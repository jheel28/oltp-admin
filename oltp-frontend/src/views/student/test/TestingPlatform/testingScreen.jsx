import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Watermark } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineCalculator,
  AiOutlineClose,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from "react-icons/ai";
import { IoMdAlarm, IoMdWarning } from "react-icons/io";
import {
  MdOutlineBookmarkAdd,
  MdOutlineBookmark,
  MdSave,
  MdOutlineVerifiedUser,
  MdLock,
} from "react-icons/md";

const STORAGE_PREFIX = "oltp_exam_v2_";
const storageKey = (testId) => `${STORAGE_PREFIX}${testId}`;
const saveState = (testId, payload) => {
  try {
    localStorage.setItem(
      storageKey(testId),
      JSON.stringify({ ...payload, savedAt: Date.now() })
    );
  } catch (_) {}
};
const loadState = (testId) => {
  try {
    const r = localStorage.getItem(storageKey(testId));
    return r ? JSON.parse(r) : null;
  } catch (_) {
    return null;
  }
};
const clearState = (testId) => {
  try {
    localStorage.removeItem(storageKey(testId));
  } catch (_) {}
};

const STATUS = {
  0: {
    bg: "bg-gray-200 text-gray-500 border-gray-300",
    dot: "bg-gray-400",
    label: "Not Visited",
  },
  1: {
    bg: "bg-red-500 text-white border-red-600",
    dot: "bg-red-500",
    label: "Not Answered",
  },
  2: {
    bg: "bg-green-500 text-white border-green-600",
    dot: "bg-green-500",
    label: "Answered",
  },
  3: {
    bg: "bg-purple-500 text-white border-purple-600",
    dot: "bg-purple-500",
    label: "Marked for Review",
  },
  4: {
    bg: "bg-purple-500 text-white border-purple-600",
    dot: "bg-purple-500",
    label: "Answered & Marked",
  },
};

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [expr, setExpr] = useState("");
  const input = (d) => {
    if (waiting) {
      setDisplay(String(d));
      setWaiting(false);
    } else setDisplay(display === "0" ? String(d) : display + d);
  };
  const decimal = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaiting(false);
    setExpr("");
  };
  const sign = () => setDisplay(String(parseFloat(display) * -1));
  const pct = () => setDisplay(String(parseFloat(display) / 100));
  const compute = (a, b, o) => {
    switch (o) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };
  const handleOp = (o) => {
    const cur = parseFloat(display);
    if (prev !== null && !waiting) {
      const r = compute(prev, cur, op);
      setDisplay(String(parseFloat(r.toFixed(10))));
      setPrev(r);
      setExpr(`${parseFloat(r.toFixed(10))} ${o}`);
    } else {
      setPrev(cur);
      setExpr(`${cur} ${o}`);
    }
    setOp(o);
    setWaiting(true);
  };
  const equals = () => {
    if (prev === null || op === null) return;
    const r = compute(prev, parseFloat(display), op);
    const rounded = parseFloat(r.toFixed(10));
    setDisplay(String(rounded));
    setExpr(`${prev} ${op} ${parseFloat(display)} =`);
    setPrev(null);
    setOp(null);
    setWaiting(true);
  };
  const btn = (l, fn, cls = "bg-gray-100 text-gray-800 hover:bg-gray-200") => (
    <button
      key={l}
      onClick={fn}
      className={`${cls} select-none rounded-xl py-3 text-sm font-bold transition-all active:scale-95`}
    >
      {l}
    </button>
  );
  return (
    <div className="fixed bottom-28 right-4 z-50 w-60 select-none overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-[#1a2744] px-4 py-2.5">
        <span className="text-xs font-bold uppercase tracking-widest text-white">
          Calculator
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-gray-900 px-4 py-3 text-right">
        <div className="h-4 truncate text-[10px] text-gray-500">{expr}</div>
        <div className="truncate text-2xl font-black tracking-tight text-white">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 p-2.5">
        {btn("C", clear, "bg-red-100 text-red-700 hover:bg-red-200")}
        {btn("+/-", sign, "bg-gray-200 text-gray-700 hover:bg-gray-300")}
        {btn("%", pct, "bg-gray-200 text-gray-700 hover:bg-gray-300")}
        {btn(
          "÷",
          () => handleOp("÷"),
          "bg-amber-500 text-white hover:bg-amber-600"
        )}
        {btn("7", () => input("7"))} {btn("8", () => input("8"))}
        {btn("9", () => input("9"))}
        {btn(
          "×",
          () => handleOp("×"),
          "bg-amber-500 text-white hover:bg-amber-600"
        )}
        {btn("4", () => input("4"))} {btn("5", () => input("5"))}
        {btn("6", () => input("6"))}
        {btn(
          "-",
          () => handleOp("-"),
          "bg-amber-500 text-white hover:bg-amber-600"
        )}
        {btn("1", () => input("1"))} {btn("2", () => input("2"))}
        {btn("3", () => input("3"))}
        {btn(
          "+",
          () => handleOp("+"),
          "bg-amber-500 text-white hover:bg-amber-600"
        )}
        <button
          onClick={() => input("0")}
          className="col-span-2 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-800 hover:bg-gray-200 active:scale-95"
        >
          0
        </button>
        {btn(".", decimal)}
        {btn("=", equals, "bg-green-500 text-white hover:bg-green-600")}
      </div>
    </div>
  );
};

const InstructionsScreen = ({ test, student, onBegin }) => {
  const [agreed, setAgreed] = useState(false);
  const [lang, setLang] = useState("en");
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex items-center justify-between bg-[#1a2744] px-6 py-3 text-white shadow">
        <div>
          <div className="text-lg font-black tracking-tight">
            Online Examination Portal
          </div>
          <div className="text-xs text-blue-300">{test?.testName}</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang((l) => (l === "en" ? "hi" : "en"))}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 py-6">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow">
          {student?.image && (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`}
              alt=""
              className="h-16 w-16 rounded-xl border-2 border-blue-100 object-cover"
            />
          )}
          <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              ["Candidate Name", `${student?.firstName} ${student?.lastName}`],
              ["Roll Number", student?.studentId],
              ["Batch", student?.batch],
              ["Test Name", test?.testName],
              ["Duration", test?.duration ? `${test.duration} min` : "—"],
              ["Total Marks", test?.totalMarks || "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <p className="font-bold text-navy-700">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-base font-black text-navy-700">
            <MdOutlineVerifiedUser className="text-blue-600" /> General
            Instructions
          </h2>
          <div className="space-y-2 text-sm leading-relaxed text-gray-700">
            {[
              "The clock will be set at the server. The countdown timer in the top-right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself — you do not need to end or submit your examination.",
              "The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols.",
              "You can click on the '>' arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click '>' which appears on the right side of question window.",
              "You can click on your 'Profile' image on top right corner of your screen to change the language during the exam for entire question paper. On clicking of Profile image you will get a drop-down to change the question content to the desired language.",
              "You can click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.",
              "To save your answer, you MUST click on the Save & Next button.",
              "This exam uses anti-malpractice monitoring. Tab switching is detected and may result in automatic submission.",
              "Do NOT refresh the page during the exam. Your answers are auto-saved every few seconds, but refreshing will trigger a confirmation dialog.",
            ].map((text, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
                  {i + 1}
                </span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow">
          <h2 className="mb-3 text-sm font-black text-navy-700">
            Question Status Legend
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(STATUS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-black ${v.bg}`}
                >
                  {k}
                </div>
                <span className="text-xs text-gray-600">{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {(test?.negativeMarking || test?.negativeFraction) && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-1 text-sm font-black text-amber-800">
              <IoMdWarning /> Marking Scheme
            </h2>
            <div className="space-y-1 text-sm text-amber-800">
              <p>
                Correct answer: <strong>+{test?.marksPerQuestion || 4}</strong>{" "}
                marks
              </p>
              <p>
                Wrong answer:{" "}
                <strong>-{test?.negativeFraction || "1/3"}</strong> ×{" "}
                {test?.marksPerQuestion || 4} marks
              </p>
              <p>
                Unattempted: <strong>0</strong> marks
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded"
            />
            <span className="text-sm text-gray-700">
              I have read all the instructions carefully and I agree to abide by
              them. I confirm that I am the candidate whose name and roll number
              are given above. I am aware that if I am found guilty of any
              malpractice or impersonation, my candidature may be cancelled.
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            disabled={!agreed}
            onClick={onBegin}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            I am ready to begin
          </button>
        </div>
      </div>
    </div>
  );
};

const TestingScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [test, setTest] = useState(null);
  const [student, setStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionStates, setQuestionStates] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerWarned30, setTimerWarned30] = useState(false);
  const [timerWarned5, setTimerWarned5] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [restored, setRestored] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [numericalDraft, setNumericalDraft] = useState({});
  const [paper, setPaper] = useState(null);
  const saveTimerRef = useRef(null);
  const submitCalledRef = useRef(false);

  const calculateScore = useCallback(() => {
    let score = 0;
    const paperObj = paper || {};
    const negFrac = parseFloat(paperObj.negativeFraction) || 0.25;
    const marksEach = parseFloat(paperObj.marksPerQuestion) || 4;

    questions.forEach((q, i) => {
      const chosen = answers[i];
      const correct = q.correctOption;
      const marks = parseFloat(q.marksPositive) || marksEach;
      const neg = parseFloat(q.marksNegative) || marks * negFrac;

      if (
        chosen === null ||
        chosen === undefined ||
        (Array.isArray(chosen) && chosen.length === 0)
      ) {
        return;
      }

      let isCorrect = false;
      if (q.type === "Numerical") {
        isCorrect =
          String(chosen).trim() === String(correct).trim() ||
          parseFloat(chosen) === parseFloat(correct);
      } else if (Array.isArray(correct)) {
        const chosenArr = Array.isArray(chosen) ? chosen : [chosen];
        if (chosenArr.length === correct.length) {
          isCorrect = chosenArr.every((c) => {
            if (correct.includes(c)) return true;
            if (q.options[c] && correct.includes(q.options[c].text)) return true;
            return false;
          });
        }
      } else {
        // MCQ 
        if (String(chosen) === String(correct)) {
          isCorrect = true;
        } else if (q.options[chosen] && q.options[chosen].text === correct) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        score += marks;
      } else if (paperObj.negativeMarking) {
        score -= neg;
      }
    });
    return Math.max(0, Math.round(score * 100) / 100);
  }, [answers, questions, paper]);

  const handleConfirmSubmit = useCallback(
    async (auto = false) => {
      if (!student || !test || !paper || submitting) return;
      setSubmitting(true);
      clearInterval(saveTimerRef.current);
      const score = calculateScore();
      const totalMarks = paper.totalMarks;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/create/score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
            body: JSON.stringify({
              marksObtained: score,
              studentId: student.studentId,
              testId: test.testId,
              paperId: test.paperId,
              totalMarks,
              questions: questions.map((q, i) => ({
                questionId: q._id,
                correctAnswer: q.correctOption,
                chosenAnswer: answers[i],
              })),
            }),
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Submission failed");
        }
        clearState(test.testId);
        message.success({
          content: auto
            ? "Time up! Test auto-submitted."
            : "Test submitted successfully.",
          key: "submit-success",
        });
        navigate(`/student/feedbackscreen/${score}/${totalMarks}`);
      } catch (err) {
        message.error({
          content: `Submission failed. ${err?.message || ""}`,
          duration: 4,
          key: "submit-fail",
        });
        setSubmitting(false);
      }
    },
    [
      student,
      test,
      paper,
      submitting,
      calculateScore,
      auth.token,
      answers,
      questions,
      navigate,
    ]
  );

  const parseEndTimestamp = (test) => {
    if (test.endDate) {
      const ts = new Date(test.endDate).getTime();
      if (!isNaN(ts)) return ts;
    }
    const dateStr = test.date;
    const timeStr = test.endTime;
    if (!dateStr || !timeStr) return null;
    const parts = dateStr.split(/[-/]/).map(Number);
    let year, month, day;
    if (parts[0] > 1000) [year, month, day] = parts;
    else if (parts[2] > 1000) [day, month, year] = parts;
    else [year, month, day] = parts;
    const [h, m] = timeStr.split(":").map(Number);
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

  const persistNow = useCallback(
    (overrides = {}) => {
      if (!test) return;
      saveState(test.testId, {
        paperId: test.paperId,
        answers: overrides.answers ?? answers,
        questionStates: overrides.questionStates ?? questionStates,
        currentQuestion: overrides.currentQuestion ?? currentQuestion,
        endTimestamp,
        tabViolations: overrides.tabViolations ?? tabViolations,
      });
      setLastSaved(Date.now());
    },
    [
      test,
      answers,
      questionStates,
      currentQuestion,
      endTimestamp,
      tabViolations,
    ]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [testRes, studentRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/test/byid/${id}`
          ),
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/student/byid/${auth.userId}`
          ),
        ]);
        const testData = await testRes.json();
        const studentData = await studentRes.json();
        const fetchedTest = testData.test;
        const fetchedStudent = studentData.student;
        setTest(fetchedTest);
        setStudent(fetchedStudent);
        const endTs = parseEndTimestamp(fetchedTest);
        setEndTimestamp(endTs);
        const questionsRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/bypaperid/${fetchedTest.paperId}`
        );
        const questionsData = await questionsRes.json();
        const qs = questionsData.questions || [];
        setQuestions(qs);
        setSections(buildSections(qs));

        const paperRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/bypaperid/${fetchedTest.paperId}`
        );
        const paperData = await paperRes.json();
        setPaper(paperData.questionPaper);

        const saved = loadState(fetchedTest.testId);
        if (saved && saved.paperId === fetchedTest.paperId) {
          if (endTs && Date.now() > endTs) {
            setAnswers(saved.answers || Array(qs.length).fill(null));
            setQuestionStates(saved.questionStates || Array(qs.length).fill(0));
            setPhase("loading");
            submitCalledRef.current = false;
            setTimeout(() => setPhase("autosubmit"), 100);
            return;
          }
          setAnswers(saved.answers || Array(qs.length).fill(null));
          setQuestionStates(saved.questionStates || Array(qs.length).fill(0));
          setCurrentQuestion(saved.currentQuestion || 0);
          setTabViolations(saved.tabViolations || 0);
          setRestored(true);
          setPhase("exam");
        } else {
          setAnswers(Array(qs.length).fill(null));
          setQuestionStates(Array(qs.length).fill(0));
          setPhase("instructions");
        }
      } catch (err) {
        console.error(err);
        message.error({
          content: `Error loading exam data: ${err?.message || ""}`,
          duration: 4,
          key: "load-error",
        });
        setPhase("error");
      }
    };
    load();
  }, [id, auth.userId]);


  useEffect(() => {
    if (phase === "autosubmit" && !submitCalledRef.current) {
      submitCalledRef.current = true;
      handleConfirmSubmit(true);
    }
  }, [phase]);

  useEffect(() => {
    if (!endTimestamp || phase !== "exam") return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((endTimestamp - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
      if (remaining <= 0 && !submitCalledRef.current) {
        submitCalledRef.current = true;
        handleConfirmSubmit(true);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [endTimestamp, phase, handleConfirmSubmit]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 1800 && timeLeft > 1795 && !timerWarned30) {
      message.warning({
        content: "30 minutes remaining!",
        duration: 4,
        key: "timer-30",
      });
      setTimerWarned30(true);
    }
    if (timeLeft <= 300 && timeLeft > 295 && !timerWarned5) {
      message.warning({
        content: "Only 5 minutes remaining!",
        duration: 5,
        style: { fontSize: 16 },
        key: "timer-5",
      });
      setTimerWarned5(true);
    }
  }, [timeLeft, timerWarned30, timerWarned5]);

  useEffect(() => {
    if (phase !== "exam" || !test) return;
    persistNow();
    clearInterval(saveTimerRef.current);
    saveTimerRef.current = setInterval(() => persistNow(), 10000);
    return () => clearInterval(saveTimerRef.current);
  }, [answers, questionStates, currentQuestion, phase, test, persistNow]);

  useEffect(() => {
    const onHide = () => {
      if (phase === "exam") persistNow();
    };
    const onUnload = (e) => {
      if (phase === "exam") {
        persistNow();
        e.preventDefault();
        e.returnValue =
          "Your exam is in progress. Are you sure you want to leave?";
      }
    };
    const onVisChange = () => {
      if (document.hidden && phase === "exam") {
        persistNow();
        setTabViolations((v) => {
          const next = v + 1;
          if (next === 1) {
            message.warning({
              content: "Warning: Tab switching detected! This is violation 1.",
              duration: 5,
              key: "tab-1",
            });
          } else if (next === 2) {
            message.error({
              content:
                "Warning: Tab switching detected again! One more violation will auto-submit.",
              duration: 6,
              key: "tab-2",
            });
          } else if (next >= 3) {
            message.error({
              content:
                "Multiple tab violations detected. Auto-submitting exam.",
              duration: 4,
              key: "tab-3",
            });
            setTimeout(() => {
              if (!submitCalledRef.current) {
                submitCalledRef.current = true;
                handleConfirmSubmit(true);
              }
            }, 2000);
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", onVisChange);
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onHide);
    };
  }, [phase, persistNow, handleConfirmSubmit]);

  useEffect(() => {
    if (phase !== "exam") return;
    const noCtx = (e) => e.preventDefault();
    const noKey = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && ["u", "s"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("keydown", noKey);
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("keydown", noKey);
    };
  }, [phase]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const goToQuestion = useCallback((idx) => {
    setCurrentQuestion(idx);
    setQuestionStates((prev) => {
      const next = [...prev];
      if (next[idx] === 0) next[idx] = 1;
      return next;
    });
  }, []);

  useEffect(() => {
    if (questions.length === 0) return;
    setQuestionStates((prev) => {
      const next = [...prev];
      if (next[currentQuestion] === 0) next[currentQuestion] = 1;
      return next;
    });
  }, [currentQuestion, questions.length]);

  const handleOptionSelect = useCallback(
    (qIdx, optIdx) => {
      const q = questions[qIdx];
      setAnswers((prev) => {
        const next = [...prev];
        if (q.type === "Numerical") {
          next[qIdx] = optIdx;
        } else if (q.multipleCorrect || Array.isArray(q.correctOption)) {
          const cur = Array.isArray(next[qIdx]) ? next[qIdx] : [];
          next[qIdx] = cur.includes(optIdx)
            ? cur.filter((x) => x !== optIdx)
            : [...cur, optIdx];
        } else {
          const cur = Array.isArray(next[qIdx]) ? next[qIdx] : [];
          next[qIdx] = cur.includes(optIdx) ? [] : [optIdx];
        }
        return next;
      });
      setQuestionStates((prev) => {
        const next = [...prev];
        const isMarked = next[qIdx] === 3 || next[qIdx] === 4;
        const nextState = isMarked ? 4 : 2;
        next[qIdx] = nextState;
        return next;
      });
      // Explicitly persist on every answer choice
      setTimeout(() => persistNow(), 0);
    },
    [questions, persistNow]
  );

  const handleClear = useCallback(() => {
    setAnswers((prev) => {
      const n = [...prev];
      n[currentQuestion] = null;
      return n;
    });
    setNumericalDraft((prev) => {
      const n = { ...prev };
      delete n[currentQuestion];
      return n;
    });
    setQuestionStates((prev) => {
      const n = [...prev];
      n[currentQuestion] = n[currentQuestion] === 4 ? 3 : 1;
      return n;
    });
  }, [currentQuestion]);

  const handleMark = useCallback(() => {
    setQuestionStates((prev) => {
      const n = [...prev];
      const cur = n[currentQuestion];
      const hasAns =
        answers[currentQuestion] !== null &&
        answers[currentQuestion] !== undefined &&
        (Array.isArray(answers[currentQuestion])
          ? answers[currentQuestion].length > 0
          : String(answers[currentQuestion]).trim() !== "");
      if (cur === 3 || cur === 4) n[currentQuestion] = hasAns ? 2 : 1;
      else n[currentQuestion] = hasAns ? 4 : 3;
      return n;
    });
  }, [currentQuestion, answers]);

  const handleSaveNext = useCallback(() => {
    const q = questions[currentQuestion];
    if (
      q?.type === "Numerical" &&
      numericalDraft[currentQuestion] !== undefined
    ) {
      handleOptionSelect(currentQuestion, numericalDraft[currentQuestion]);
    }
    if (currentQuestion < questions.length - 1)
      goToQuestion(currentQuestion + 1);
  }, [
    currentQuestion,
    questions,
    numericalDraft,
    handleOptionSelect,
    goToQuestion,
  ]);

  const handleMarkNext = useCallback(() => {
    handleMark();
    if (currentQuestion < questions.length - 1)
      goToQuestion(currentQuestion + 1);
  }, [handleMark, currentQuestion, questions.length, goToQuestion]);



  const answeredCount = useMemo(
    () =>
      answers.filter(
        (a) =>
          a !== null &&
          a !== undefined &&
          (Array.isArray(a) ? a.length > 0 : String(a).trim() !== "")
      ).length,
    [answers]
  );
  const markedCount = useMemo(
    () => questionStates.filter((s) => s === 3 || s === 4).length,
    [questionStates]
  );
  const notVisited = useMemo(
    () => questionStates.filter((s) => s === 0).length,
    [questionStates]
  );

  const formatTime = (secs) => {
    if (secs === null) return "--:--:--";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
          s
        ).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (phase === "loading" || phase === "autosubmit") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100">
        <div className="border-t-transparent h-14 w-14 animate-spin rounded-full border-4 border-blue-600" />
        <p className="font-bold text-gray-600">
          {phase === "autosubmit"
            ? "Auto-submitting exam..."
            : "Loading exam..."}
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow">
          <p className="mb-4 text-lg font-bold text-red-500">
            Failed to load exam
          </p>
          <button
            onClick={() => navigate("/student/default")}
            className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white"
          >
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
        onBegin={() => {
          setPhase("exam");
          document.documentElement
            .requestFullscreen()
            .then(() => setIsFullscreen(true))
            .catch(() => {});
        }}
      />
    );
  }

  if (phase === "submit") {
    const notAns = questionStates.filter((s) => s === 1).length;
    const ans = questionStates.filter((s) => s === 2 || s === 4).length;
    const markedOnly = questionStates.filter((s) => s === 3).length;
    const ansMarked = questionStates.filter((s) => s === 4).length;
    const nv = questionStates.filter((s) => s === 0).length;

    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <div className="bg-[#1a2744] px-6 py-3 text-center font-black text-white shadow">
          Online Examination Portal — Submit Confirmation
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-1 text-2xl font-black text-navy-700">
              Submit Examination?
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Please verify your answers before submitting. Once submitted, you
              cannot change them.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-3">
              {[
                {
                  label: "Answered",
                  value: ans,
                  cls: "bg-green-50 border-green-200 text-green-700",
                },
                {
                  label: "Not Answered",
                  value: notAns,
                  cls: "bg-red-50 border-red-200 text-red-700",
                },
                {
                  label: "Marked for Review",
                  value: markedOnly,
                  cls: "bg-purple-50 border-purple-200 text-purple-700",
                },
                {
                  label: "Answered & Marked",
                  value: ansMarked,
                  cls: "bg-purple-50 border-purple-200 text-purple-700",
                },
                {
                  label: "Not Visited",
                  value: nv,
                  cls: "bg-gray-50 border-gray-200 text-gray-500",
                },
                {
                  label: "Total Questions",
                  value: questions.length,
                  cls: "bg-blue-50 border-blue-200 text-blue-700",
                },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-3 ${s.cls}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-2xl font-black">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {ans < questions.length
                ? `You have ${
                    questions.length - ans
                  } unanswered question(s). Are you sure you want to submit?`
                : "All questions have been answered."}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPhase("exam")}
                className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50"
              >
                Return to Exam
              </button>
              <button
                onClick={() => handleConfirmSubmit(false)}
                disabled={submitting}
                className="flex-1 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Final"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const currentAns = answers[currentQuestion];
  const isCurrentMarked =
    questionStates[currentQuestion] === 3 ||
    questionStates[currentQuestion] === 4;
  const isUrgent = timeLeft !== null && timeLeft <= 300;
  const isWarning = timeLeft !== null && timeLeft <= 1800 && !isUrgent;

  return (
    <Watermark
      content={`${student?.studentId || ""} — ${test?.testId || ""}`}
      gap={[140, 140]}
      offset={[70, 70]}
      rotate={-15}
      fontSize={11}
      fontColor="rgba(0,0,0,0.04)"
    >
      <div className="flex h-screen select-none flex-col overflow-hidden bg-gray-100 text-navy-700">
        <div className="z-30 flex flex-none items-center justify-between bg-[#1a2744] px-4 py-2.5 shadow-lg">
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-white">
              {test?.testName}
            </div>
            <div className="text-[10px] text-blue-300">
              {test?.category} {test?.subject ? `· ${test.subject}` : ""}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {tabViolations > 0 && (
              <div
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  tabViolations >= 2
                    ? "animate-pulse bg-red-500 text-white"
                    : "bg-amber-400 text-amber-900"
                }`}
              >
                <IoMdWarning /> {tabViolations} violation
                {tabViolations !== 1 ? "s" : ""}
              </div>
            )}
            {lastSaved && (
              <div className="hidden items-center gap-1 text-[10px] text-blue-300 sm:flex">
                <MdSave className="h-3 w-3" />
                <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
              </div>
            )}
            <button
              onClick={toggleFullscreen}
              className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <AiOutlineFullscreenExit />
              ) : (
                <AiOutlineFullscreen />
              )}
            </button>
            <div
              className={`flex min-w-[90px] items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-base font-black tabular-nums ${
                isUrgent
                  ? "animate-pulse bg-red-500 text-white"
                  : isWarning
                  ? "bg-amber-400 text-amber-900"
                  : "bg-white/15 text-white"
              }`}
            >
              <IoMdAlarm className="h-4 w-4 flex-shrink-0" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {restored && (
          <div className="flex-none border-b border-yellow-200 bg-yellow-50 px-4 py-1.5 text-center text-xs font-medium text-yellow-800">
            Session restored after interruption — your answers from the previous
            session have been recovered.
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {sections.length > 1 && (
              <div className="flex flex-none gap-0 overflow-x-auto border-b border-gray-200 bg-white">
                {sections.map((sec, i) => {
                  const secAnswered = sec.indices.filter(
                    (idx) =>
                      questionStates[idx] === 2 || questionStates[idx] === 4
                  ).length;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(i);
                        goToQuestion(sec.indices[0]);
                      }}
                      className={`flex-shrink-0 border-b-2 px-5 py-2.5 text-xs font-bold transition-all ${
                        activeSection === i
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
              <div className="mx-auto max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-400">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    {currentQ?.topic && (
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {currentQ.topic}
                      </span>
                    )}
                    {currentQ?.type === "Numerical" ? (
                      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        Integer Type
                      </span>
                    ) : currentQ?.multipleCorrect ? (
                      <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                        Multiple Correct
                      </span>
                    ) : (
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                        Single Correct
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                      +{currentQ?.marks || test?.marksPerQuestion || 4}
                    </div>
                    {test?.negativeMarking && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                        -
                        {(
                          (currentQ?.marks || test?.marksPerQuestion || 4) *
                          (parseFloat(test?.negativeFraction) || 1 / 3)
                        ).toFixed(2)}
                      </div>
                    )}
                    <button
                      onClick={handleMark}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                        isCurrentMarked
                          ? "border-purple-500 bg-purple-500 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600"
                      }`}
                    >
                      {isCurrentMarked ? (
                        <MdOutlineBookmark />
                      ) : (
                        <MdOutlineBookmarkAdd />
                      )}
                      {isCurrentMarked ? "Marked" : "Mark for Review"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p
                    className="mb-5 text-sm font-bold leading-relaxed text-gray-800"
                    style={{ userSelect: "none", WebkitUserSelect: "none" }}
                  >
                    {currentQ?.text}
                  </p>

                  {currentQ?.questionImage && (
                    <div className="mb-5 flex justify-center rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/${currentQ.questionImage}`}
                        alt="Question"
                        className="max-h-72 max-w-full rounded-lg object-contain"
                        draggable={false}
                      />
                    </div>
                  )}

                  {currentQ?.type === "Numerical" ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Enter your numerical answer:
                      </p>
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        placeholder="Enter numerical value"
                        value={
                          numericalDraft[currentQuestion] !== undefined
                            ? numericalDraft[currentQuestion]
                            : currentAns !== null && currentAns !== undefined
                            ? currentAns
                            : ""
                        }
                        onChange={(e) => {
                          setNumericalDraft((prev) => ({
                            ...prev,
                            [currentQuestion]: e.target.value,
                          }));
                          handleOptionSelect(currentQuestion, e.target.value);
                        }}
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-xl font-black text-navy-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />
                      <p className="text-[10px] text-gray-400">
                        For decimal answers, use the decimal point (e.g. 3.14)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {(currentQ?.options || []).map((option, optIdx) => {
                        const selectedArr = Array.isArray(currentAns)
                          ? currentAns
                          : [];
                        const isSelected = selectedArr.includes(optIdx);
                        return (
                          <div
                            key={optIdx}
                            onClick={() =>
                              handleOptionSelect(currentQuestion, optIdx)
                            }
                            className={`group flex cursor-pointer items-start gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-150 ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 text-xs font-black transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-500 text-white"
                                  : "border-gray-300 bg-gray-50 text-gray-400 group-hover:border-blue-300"
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span
                                className={`text-sm font-semibold leading-relaxed ${
                                  isSelected ? "text-blue-700" : "text-gray-700"
                                }`}
                              >
                                {option.text}
                              </span>
                              {option.image && (
                                <img
                                  src={`${process.env.REACT_APP_BACKEND_URL}/${option.image}`}
                                  alt=""
                                  className="mt-2 max-h-24 rounded-lg"
                                  draggable={false}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentQuestion > 0) goToQuestion(currentQuestion - 1);
                  }}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-40"
                >
                  <AiOutlineArrowLeft /> Previous
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleMarkNext}
                  className="rounded-xl border border-purple-300 px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50"
                >
                  Mark & Next
                </button>
                <button
                  onClick={() => setShowCalc((v) => !v)}
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50"
                >
                  <AiOutlineCalculator className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveNext}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700"
                >
                  Save & Next <AiOutlineArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden w-72 flex-shrink-0 flex-col overflow-hidden border-l border-gray-200 bg-white lg:flex xl:w-80">
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
              {student?.image && (
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-xl border-2 border-blue-100 object-cover"
                  draggable={false}
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-navy-700">
                  {student?.firstName} {student?.lastName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {student?.studentId}
                </p>
              </div>
              <MdLock
                className="ml-auto flex-shrink-0 text-green-500"
                title="Secure exam"
              />
            </div>

            <div className="grid grid-cols-3 border-b border-gray-100">
              {[
                {
                  v: answeredCount,
                  l: "Answered",
                  c: "text-green-600 bg-green-50",
                },
                {
                  v: questions.length - answeredCount,
                  l: "Pending",
                  c: "text-red-500 bg-red-50",
                },
                {
                  v: markedCount,
                  l: "Marked",
                  c: "text-purple-600 bg-purple-50",
                },
              ].map((s) => (
                <div key={s.l} className={`py-3 text-center ${s.c}`}>
                  <p className={`text-xl font-black ${s.c.split(" ")[0]}`}>
                    {s.v}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-b border-gray-100 px-4 py-3">
              {Object.entries(STATUS).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-black ${v.bg}`}
                  >
                    {k}
                  </div>
                  <span className="text-[11px] text-gray-500">{v.label}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {sections.map((sec, si) => (
                <div key={si} className={`${si > 0 ? "mt-4" : ""}`}>
                  {sections.length > 1 && (
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      {sec.name}
                    </p>
                  )}
                  <div className="grid grid-cols-7 gap-1.5">
                    {sec.indices.map((qIdx) => {
                      const cfg = STATUS[questionStates[qIdx]] || STATUS[0];
                      return (
                        <button
                          key={qIdx}
                          onClick={() => {
                            goToQuestion(qIdx);
                            if (si !== activeSection) setActiveSection(si);
                          }}
                          className={`h-8 w-8 rounded-lg border text-[11px] font-black transition-all ${
                            cfg.bg
                          } ${
                            currentQuestion === qIdx
                              ? "scale-110 shadow-md ring-2 ring-blue-500 ring-offset-1"
                              : "hover:scale-105"
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                <span>Not visited: {notVisited}</span>
                <span>
                  {answeredCount}/{questions.length} done
                </span>
              </div>
              <button
                onClick={() => setPhase("submit")}
                className="active:scale-98 w-full rounded-xl bg-[#1a2744] py-3 font-black text-white shadow transition-all hover:bg-navy-800"
              >
                End Test
              </button>
            </div>
          </div>
        </div>

        {showCalc && <Calculator onClose={() => setShowCalc(false)} />}

        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-2 lg:hidden">
          <button
            onClick={() => setShowCalc((v) => !v)}
            className="rounded-lg border p-2 text-gray-500"
          >
            <AiOutlineCalculator />
          </button>
          <button
            onClick={() => setPhase("submit")}
            className="flex-1 rounded-xl bg-[#1a2744] py-2.5 text-sm font-black text-white"
          >
            End Test
          </button>
        </div>
      </div>
    </Watermark>
  );
};

export default TestingScreen;
