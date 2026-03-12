import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Watermark } from "antd";
import { AuthContext } from "components/Auth-context";

import { saveState, loadState, clearState } from "./hooks/usePersistence";
import { useTimer } from "./hooks/useTimer";
import { useProctoring } from "./hooks/useProctoring";
import {
  useExamAnswers,
  getCorrectAnswer,
  scoreQuestion,
  answerIsEmpty,
} from "./hooks/useExamState";

import Calculator from "./components/Calculator";
import InstructionsScreen from "./components/InstructionsScreen";
import SubmitScreen from "./components/SubmitScreen";
import ExamHeader from "./components/ExamHeader";
import QuestionDisplay from "./components/QuestionDisplay.jsx";
import QuestionPalette from "./components/QuestionPalette";
import BottomBar, { MobileBar } from "./components/BottomBar";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const parseEndTimestamp = (test) => {
  const { date, endTime } = test || {};
  if (!date || !endTime) return null;
  const parts = date.split(/[-/]/).map(Number);
  let year, month, day;
  if (parts[0] > 1000) [year, month, day] = parts;
  else if (parts[2] > 1000) [day, month, year] = parts;
  else [year, month, day] = parts;
  const [h, m] = endTime.split(":").map(Number);
  return new Date(year, month - 1, day, h, m, 0).getTime();
};

const buildSections = (qs) => {
  const map = {};
  qs.forEach((q, i) => {
    const key = q.section || q.topic || "All Questions";
    if (!map[key]) map[key] = [];
    map[key].push(i);
  });
  const keys = Object.keys(map);
  if (keys.length === 1)
    return [{ name: "All Questions", indices: map[keys[0]] }];
  return keys.map((k) => ({ name: k, indices: map[k] }));
};

const padArray = (arr, len, fill) =>
  Array.from({ length: len }, (_, i) =>
    arr && i < arr.length && arr[i] !== undefined ? arr[i] : fill
  );

const TestingScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [paper, setPaper] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [phase, setPhase] = useState("loading");
  const [restored, setRestored] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submitCalledRef = useRef(false);
  const saveTimerRef = useRef(null);

  const exam = useExamAnswers(questions.length || 0);

  const allowCalculator = test?.allowCalculator !== false;
  const allowWatermark = test?.allowWatermark !== false;

  const passingFraction = (() => {
    if (test?.passingPercentage != null && test.passingPercentage > 0)
      return test.passingPercentage / 100;
    if (paper?.passingPercentage != null)
      return paper.passingPercentage / 100;
    return 0.35;
  })();

  const persistNow = useCallback(() => {
    if (!test || !questions.length) return;
    const len = questions.length;
    saveState(test.testId, {
      paperId: test.paperId,
      answers: padArray(exam.answers, len, null),
      statuses: padArray(exam.statuses, len, 0),
      currentIdx: exam.currentIdx,
      endTimestamp,
    });
    setLastSaved(Date.now());
  }, [test, questions.length, exam.answers, exam.statuses, exam.currentIdx, endTimestamp]);

  const handleAutoSubmit = useCallback(() => {
    if (!submitCalledRef.current) {
      submitCalledRef.current = true;
      setPhase("autosubmit");
    }
  }, []);

  const { violations, isFullscreen, toggleFullscreen, markSubmitFired } =
    useProctoring({
      phase,
      testId: test?.testId,
      onAutoSubmit: handleAutoSubmit,
      onPersist: persistNow,
    });

  const {
    timeLeft, isUrgent, isWarning, formatTime,
    warned30, warned5, setWarned30, setWarned5,
  } = useTimer({ endTimestamp, phase, onExpire: handleAutoSubmit });

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 1800 && timeLeft > 1795 && !warned30) {
      message.warning({ content: "30 minutes remaining!", duration: 4, key: "warn-30" });
      setWarned30(true);
    }
    if (timeLeft <= 300 && timeLeft > 295 && !warned5) {
      message.warning({ content: "Only 5 minutes remaining!", duration: 5, key: "warn-5" });
      setWarned5(true);
    }
  }, [timeLeft, warned30, warned5, setWarned30, setWarned5]);

  useEffect(() => {
    if (phase !== "exam" || !test) return;
    persistNow();
    clearInterval(saveTimerRef.current);
    saveTimerRef.current = setInterval(persistNow, 10000);
    return () => clearInterval(saveTimerRef.current);
  }, [exam.answers, exam.statuses, exam.currentIdx, phase, test, persistNow]);

  const buildSubmission = useCallback(() => {
    const totalMarks = paper?.totalMarks ?? 0;
    let marksObtained = 0;
    const questionPayload = questions.map((q, i) => {
      const chosen = exam.answers[i] ?? null;
      const correctAnswer = getCorrectAnswer(q);
      const marksAwarded = scoreQuestion(q, chosen, paper);
      marksObtained += marksAwarded;
      return {
        questionId: String(q._id),
        questionType: q.type || "MCQ",
        correctAnswer,
        chosenAnswer: answerIsEmpty(chosen) ? null : chosen,
        marksAwarded,
      };
    });
    marksObtained = Math.max(0, Math.round(marksObtained * 100) / 100);
    return {
      testId: test.testId,
      studentId: student.studentId,
      paperId: test.paperId,
      marksObtained,
      totalMarks,
      passed: totalMarks > 0 ? marksObtained / totalMarks >= passingFraction : false,
      questions: questionPayload,
    };
  }, [questions, exam.answers, paper, test, student, passingFraction]);

  const handleConfirmSubmit = useCallback(
    async (auto = false) => {
      if (!student || !test || submitting) return;
      setSubmitting(true);
      markSubmitFired();
      clearInterval(saveTimerRef.current);

      try {
        const payload = buildSubmission();
        const res = await fetch(`${BACKEND}/api/v1/score/create/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Server error ${res.status}`);
        }
        clearState(test.testId);
        message.success({
          content: auto ? "Time up! Test auto-submitted." : "Test submitted successfully.",
          key: "submit-success",
        });
        navigate(`/student/feedbackscreen/${payload.marksObtained}/${payload.totalMarks}`);
      } catch (err) {
        console.error("Submission error:", err);
        message.error({
          content: `Submission failed: ${err?.message || "Unknown error"}`,
          duration: 6,
          key: "submit-fail",
        });
        setSubmitting(false);
      }
    },
    [student, test, submitting, buildSubmission, auth.token, navigate, markSubmitFired]
  );

  useEffect(() => {
    if (phase === "autosubmit" && !submitting) handleConfirmSubmit(true);
  }, [phase, submitting, handleConfirmSubmit]);

  useEffect(() => {
    const load = async () => {
      try {
        const [testRes, studentRes] = await Promise.all([
          fetch(`${BACKEND}/api/v1/test/get/test/byid/${id}`),
          fetch(`${BACKEND}/api/v1/student/get/student/byid/${auth.userId}`, {
            headers: { Authorization: "Bearer " + auth.token },
          }),
        ]);
        const { test: fetchedTest } = await testRes.json();
        const { student: fetchedStudent } = await studentRes.json();
        if (!fetchedTest || !fetchedStudent)
          throw new Error("Missing test or student data");

        setTest(fetchedTest);
        setStudent(fetchedStudent);

        const endTs = parseEndTimestamp(fetchedTest);
        setEndTimestamp(endTs);

        const [qRes, paperRes] = await Promise.all([
          fetch(
            `${BACKEND}/api/v1/question/get/questions/bypaperid/${fetchedTest.paperId}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          ),
          fetch(
            `${BACKEND}/api/v1/questionpaper/get/questionpaper/bypaperid/${fetchedTest.paperId}`
          ),
        ]);
        const { questions: qs = [] } = await qRes.json();
        const { questionPaper } = await paperRes.json();

        setQuestions(qs);
        setSections(buildSections(qs));
        setPaper(questionPaper);

        const saved = loadState(fetchedTest.testId);

        if (
          saved &&
          saved.paperId === fetchedTest.paperId &&
          Array.isArray(saved.answers)
        ) {
          const len = qs.length;
          const paddedAnswers = padArray(saved.answers, len, null);
          const paddedStatuses = padArray(saved.statuses, len, 0);

          const effectiveEndTs = endTs || saved.endTimestamp || null;

          if (effectiveEndTs && Date.now() > effectiveEndTs) {
            if (!endTs && saved.endTimestamp) setEndTimestamp(saved.endTimestamp);
            exam.restore(paddedAnswers, paddedStatuses, 0);
            setPhase("autosubmit");
            return;
          }

          if (!endTs && saved.endTimestamp) {
            setEndTimestamp(saved.endTimestamp);
          }

          exam.restore(paddedAnswers, paddedStatuses, saved.currentIdx || 0);
          setRestored(true);
          setPhase("exam");
        } else {
          clearState(fetchedTest.testId);
          setPhase("instructions");
        }
      } catch (err) {
        console.error("Load error:", err);
        message.error({ content: `Error loading exam: ${err?.message || ""}`, key: "load-error" });
        setPhase("error");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth.userId, auth.token]);

  const currentQ = questions[exam.currentIdx];
  const isMarked = exam.statuses[exam.currentIdx] === 3 || exam.statuses[exam.currentIdx] === 4;

  const handleDraftSelect = useCallback(
    (value) => {
      if (!currentQ) return;
      exam.updateDraft(currentQ.type, currentQ.type === "NAT" ? value : Number(value));
    },
    [exam, currentQ]
  );

  const handleSaveNext = useCallback(() => {
    exam.commitDraft();
    if (exam.currentIdx < questions.length - 1) exam.goTo(exam.currentIdx + 1);
  }, [exam, questions.length]);

  const handleMarkSaveNext = useCallback(() => {
    exam.commitDraft();
    exam.toggleMark();
    if (exam.currentIdx < questions.length - 1) exam.goTo(exam.currentIdx + 1);
  }, [exam, questions.length]);

  if (phase === "loading" || phase === "autosubmit") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100">
        <div className="border-t-transparent h-14 w-14 animate-spin rounded-full border-4 border-blue-600" />
        <p className="font-bold text-gray-600">
          {phase === "autosubmit" ? "Auto-submitting exam\u2026" : "Loading exam\u2026"}
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow">
          <p className="mb-4 text-lg font-bold text-red-500">Failed to load exam</p>
          <button onClick={() => navigate("/student/default")} className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === "instructions") {
    return (
      <InstructionsScreen
        test={test}
        student={student}
        paper={paper}
        onBegin={() => {
          clearState(test.testId);
          if (test.isPermanent && test.duration) {
            setEndTimestamp(Date.now() + test.duration * 60 * 1000);
          }
          setPhase("exam");
          document.documentElement.requestFullscreen?.().catch(() => {});
        }}
      />
    );
  }

  if (phase === "submit") {
    return (
      <SubmitScreen
        stats={exam.stats}
        questionCount={questions.length}
        hasDraft={exam.hasDraft}
        currentQuestion={exam.currentIdx}
        submitting={submitting}
        onReturn={() => setPhase("exam")}
        onSubmit={() => handleConfirmSubmit(false)}
      />
    );
  }

  const examContent = (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-gray-100 text-navy-700">
      <ExamHeader
        testName={test?.testName}
        category={test?.category}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isUrgent={isUrgent}
        isWarning={isWarning}
        violations={violations}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        lastSaved={lastSaved}
      />

      {restored && (
        <div className="flex-none border-b border-yellow-200 bg-yellow-50 px-4 py-1.5 text-center text-xs font-medium text-yellow-800">
          Session restored \u2014 your previously saved answers have been recovered.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {sections.length > 1 && (
            <div className="flex flex-none gap-0 overflow-x-auto border-b border-gray-200 bg-white">
              {sections.map((sec, i) => {
                const secAnswered = sec.indices.filter(
                  (idx) => exam.statuses[idx] === 2 || exam.statuses[idx] === 4
                ).length;
                return (
                  <button
                    key={i}
                    onClick={() => { setActiveSection(i); exam.goTo(sec.indices[0]); }}
                    className={`flex-shrink-0 border-b-2 px-5 py-2.5 text-xs font-bold transition-all ${
                      activeSection === i
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-transparent text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {sec.name}
                    <span className="ml-1.5 text-[10px] opacity-70">
                      ({secAnswered}/{sec.indices.length})
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
            <QuestionDisplay
              question={currentQ}
              questionNumber={exam.currentIdx + 1}
              totalQuestions={questions.length}
              currentDraft={exam.currentDraft}
              savedAnswer={exam.savedAnswer}
              hasDraft={exam.hasDraft}
              isMarked={isMarked}
              onDraftSelect={handleDraftSelect}
              onToggleMark={exam.toggleMark}
            />
          </div>

          <BottomBar
            currentIdx={exam.currentIdx}
            totalQuestions={questions.length}
            allowCalculator={allowCalculator}
            isMarked={isMarked}
            onPrev={() => { if (exam.currentIdx > 0) exam.goTo(exam.currentIdx - 1); }}
            onSaveNext={handleSaveNext}
            onMarkSaveNext={handleMarkSaveNext}
            onClear={exam.clearDraft}
            onEndTest={() => setPhase("submit")}
            onToggleCalc={() => setShowCalc((v) => !v)}
          />
        </div>

        <QuestionPalette
          student={student}
          sections={sections}
          statuses={exam.statuses}
          currentIdx={exam.currentIdx}
          hasDraft={exam.hasDraft}
          activeSection={activeSection}
          onGoTo={exam.goTo}
          onSetSection={setActiveSection}
          onEndTest={() => setPhase("submit")}
          stats={exam.stats}
        />
      </div>

      {allowCalculator && showCalc && <Calculator onClose={() => setShowCalc(false)} />}

      <MobileBar
        allowCalculator={allowCalculator}
        onToggleCalc={() => setShowCalc((v) => !v)}
        onEndTest={() => setPhase("submit")}
        onPrev={() => { if (exam.currentIdx > 0) exam.goTo(exam.currentIdx - 1); }}
        onSaveNext={handleSaveNext}
        onMarkSaveNext={handleMarkSaveNext}
        onClear={exam.clearDraft}
        isMarked={isMarked}
        currentIdx={exam.currentIdx}
        totalQuestions={questions.length}
      />
    </div>
  );

  return allowWatermark ? (
    <Watermark
      content={[`${student?.studentId || ""}`, `${test?.testId || ""}`]}
      gap={[160, 100]} offset={[80, 50]} rotate={-15}
      fontSize={12} fontColor="rgba(0,0,0,0.06)" zIndex={9}
    >
      {examContent}
    </Watermark>
  ) : examContent;
};

export default TestingScreen;