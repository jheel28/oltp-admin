import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdRefresh,
  MdSearch,
  MdDownload,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdRemoveCircle,
  MdEdit,
  MdSave,
  MdUndo,
} from "react-icons/md";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const normImg = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const isCorrectAnswer = (scoreQ, question) => {
  const chosen = scoreQ.chosenAnswer;
  const correct = scoreQ.correctAnswer;
  if (chosen === null || chosen === undefined) return false;
  if (
    question?.type === "NAT" ||
    (correct && typeof correct === "object" && !Array.isArray(correct))
  ) {
    const val = parseFloat(chosen);
    return (
      !isNaN(val) &&
      val >= parseFloat(correct?.min) &&
      val <= parseFloat(correct?.max)
    );
  }
  if (Array.isArray(correct)) {
    const ca = (Array.isArray(chosen) ? chosen : [chosen]).map(Number);
    const co = correct.map(Number);
    return ca.length === co.length && ca.every((v) => co.includes(v));
  }
  const chosenVal = Array.isArray(chosen) ? chosen[0] : chosen;
  return String(chosenVal) === String(correct);
};

const getDefaultPositiveMarks = (question, paper) => {
  if (question?.marksPositive != null) return question.marksPositive;
  if (paper?.marksPerQuestion != null) return paper.marksPerQuestion;
  return 4;
};

const getDefaultNegativeMarks = (question, paper) => {
  if (!paper?.negativeMarking) return 0;
  const pos = getDefaultPositiveMarks(question, paper);
  if (question?.marksNegative != null) return question.marksNegative;
  return -(pos * (paper?.negativeFraction ?? 0.25));
};

const AnswerSheetModal = ({ score: initialScore, questions, paper, onClose, onSaved }) => {
  const auth = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editedMarks, setEditedMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(initialScore);

  if (!score) return null;

  const scoreQuestions = score.questions || [];

  const displayItems = scoreQuestions.map((sq) => ({
    scoreQ: sq,
    question: questions.find((q) => String(q._id) === String(sq.questionId)),
  }));

  const enterEditMode = () => {
    const initial = {};
    scoreQuestions.forEach((sq) => {
      initial[String(sq.questionId)] = String(sq.marksAwarded);
    });
    setEditedMarks(initial);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditedMarks({});
    setEditMode(false);
  };

  const setQuestionMark = (questionId, value) => {
    setEditedMarks((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const applyPreset = (questionId, preset, question) => {
    const pos = getDefaultPositiveMarks(question, paper);
    const neg = getDefaultNegativeMarks(question, paper);
    const val =
      preset === "correct" ? String(pos) :
      preset === "wrong" ? String(neg) :
      "0";
    setEditedMarks((prev) => ({ ...prev, [String(questionId)]: val }));
  };

  const computeNewTotal = () => {
    return scoreQuestions.reduce((sum, sq) => {
      const val = editMode
        ? parseFloat(editedMarks[String(sq.questionId)] ?? sq.marksAwarded)
        : sq.marksAwarded;
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const newTotal = editMode ? Math.max(0, Math.round(computeNewTotal() * 100) / 100) : score.marksObtained;
  const newPct = score.totalMarks > 0 ? Math.round((newTotal / score.totalMarks) * 10000) / 100 : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedQuestions = scoreQuestions.map((sq) => ({
        questionId: String(sq.questionId),
        marksAwarded: parseFloat(editedMarks[String(sq.questionId)] ?? sq.marksAwarded) || 0,
      }));

      const res = await fetch(
        `${BACKEND}/api/v1/score/update/${score._id}/questions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({ questions: updatedQuestions }),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setScore(data.score);
      setEditMode(false);
      setEditedMarks({});
      message.success("Answer sheet updated successfully");
      if (onSaved) onSaved(data.score);
    } catch (err) {
      message.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl">
        <Card extra="w-full p-5 my-6 shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-navy-700 dark:text-white">
                Answer Sheet &mdash; {score.studentName || score.studentId}
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                {score.testName} &bull; {score.studentId}
                {score.batch ? ` &bull; ${score.batch}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${editMode ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {editMode ? `Preview: ${newTotal}` : score.marksObtained} / {score.totalMarks} marks
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${editMode ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>
                  {editMode ? newPct : score.percentage}%
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${score.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {score.passed ? "Pass" : "Fail"}
                </span>
                {editMode && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    Editing &mdash; unsaved changes
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!editMode ? (
                <button
                  onClick={enterEditMode}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-600"
                >
                  <MdEdit className="h-3.5 w-3.5" /> Edit Marks
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    <MdUndo className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-600 disabled:opacity-50"
                  >
                    <MdSave className="h-3.5 w-3.5" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          {editMode && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <strong>Edit mode:</strong> Use the preset buttons (Correct / Wrong / Skipped) or type a custom marks value directly. Marks are recalculated live. Click <strong>Save Changes</strong> to persist.
            </div>
          )}

          {displayItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No question data recorded for this submission.
            </div>
          ) : (
            <ul className="space-y-3">
              {displayItems.map(({ scoreQ, question }, index) => {
                const chosen = scoreQ.chosenAnswer;
                const correct = scoreQ.correctAnswer;
                const skipped =
                  chosen === null ||
                  chosen === undefined ||
                  (Array.isArray(chosen) && chosen.length === 0);
                const isNAT =
                  question?.type === "NAT" ||
                  (correct &&
                    typeof correct === "object" &&
                    !Array.isArray(correct));
                const correct_ = !skipped && isCorrectAnswer(scoreQ, question);

                const chosenArr = Array.isArray(chosen)
                  ? chosen.map(Number)
                  : chosen !== null && chosen !== undefined
                  ? [Number(chosen)]
                  : [];

                const correctArr = Array.isArray(correct)
                  ? correct.map(Number)
                  : !isNAT && correct !== null && correct !== undefined
                  ? [Number(correct)]
                  : [];

                const currentMarks = editMode
                  ? editedMarks[String(scoreQ.questionId)] ?? String(scoreQ.marksAwarded)
                  : scoreQ.marksAwarded;

                const displayMarks = editMode
                  ? parseFloat(currentMarks) || 0
                  : scoreQ.marksAwarded;

                const borderCls = skipped
                  ? "border-gray-200 bg-gray-50"
                  : correct_
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50";

                const editBorderCls = editMode
                  ? "border-amber-300 bg-amber-50/40"
                  : borderCls;

                const qImgSrc = normImg(question?.questionImage);

                const posMarks = getDefaultPositiveMarks(question, paper);
                const negMarks = getDefaultNegativeMarks(question, paper);

                return (
                  <li
                    key={scoreQ.questionId || index}
                    className={`rounded-xl border p-4 transition-colors ${editBorderCls}`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="mr-1 text-[10px] font-bold uppercase text-gray-400">
                          Q{index + 1}
                        </span>
                        <span className="text-sm font-semibold text-navy-700 dark:text-white">
                          {question?.text || `Question ${index + 1}`}
                        </span>
                        {question?.type && (
                          <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-500">
                            {question.type}
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {!editMode ? (
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              skipped ? "bg-gray-100 text-gray-500" :
                              correct_ ? "bg-green-100 text-green-700" :
                              "bg-red-100 text-red-600"
                            }`}>
                              {skipped ? <MdRemoveCircle className="h-3 w-3" /> :
                               correct_ ? <MdCheckCircle className="h-3 w-3" /> :
                               <MdCancel className="h-3 w-3" />}
                              {skipped ? "Skipped" : correct_ ? "Correct" : "Wrong"}
                            </span>
                            <span className={`text-xs font-bold ${
                              scoreQ.marksAwarded > 0 ? "text-green-600" :
                              scoreQ.marksAwarded < 0 ? "text-red-500" :
                              "text-gray-400"
                            }`}>
                              {scoreQ.marksAwarded > 0 ? `+${scoreQ.marksAwarded}` : scoreQ.marksAwarded}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => applyPreset(scoreQ.questionId, "correct", question)}
                                className="rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 transition hover:bg-green-200"
                              >
                                +{posMarks} Correct
                              </button>
                              {negMarks < 0 && (
                                <button
                                  onClick={() => applyPreset(scoreQ.questionId, "wrong", question)}
                                  className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600 transition hover:bg-red-200"
                                >
                                  {negMarks} Wrong
                                </button>
                              )}
                              <button
                                onClick={() => applyPreset(scoreQ.questionId, "skip", question)}
                                className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 transition hover:bg-gray-200"
                              >
                                0 Skip
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-400">Custom:</span>
                              <input
                                type="number"
                                step="0.25"
                                value={currentMarks}
                                onChange={(e) => setQuestionMark(scoreQ.questionId, e.target.value)}
                                className="w-20 rounded-md border border-amber-300 bg-white px-2 py-1 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                              <span className={`text-xs font-bold ${
                                displayMarks > 0 ? "text-green-600" :
                                displayMarks < 0 ? "text-red-500" :
                                "text-gray-400"
                              }`}>
                                {displayMarks > 0 ? `+${displayMarks}` : displayMarks}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {qImgSrc && (
                      <img
                        src={qImgSrc}
                        alt="question"
                        className="mb-3 max-h-40 max-w-full rounded-lg border border-gray-200 bg-gray-50 object-contain"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}

                    {isNAT ? (
                      <div className="space-y-1 text-sm">
                        {skipped ? (
                          <p className="italic text-gray-400">Not answered</p>
                        ) : (
                          <p>
                            Student answered:{" "}
                            <strong className={correct_ ? "text-green-700" : "text-red-600"}>
                              {String(chosen)}
                            </strong>
                          </p>
                        )}
                        {correct && typeof correct === "object" && (
                          <p className="text-blue-600">
                            Correct range:{" "}
                            <strong>{correct.min} &ndash; {correct.max}</strong>
                          </p>
                        )}
                      </div>
                    ) : question?.options?.length > 0 ? (
                      <div className="space-y-1.5">
                        {question.options.map((opt, oi) => {
                          const isChosen = chosenArr.includes(oi);
                          const isCorrectOpt = correctArr.includes(oi);
                          const optImgSrc = normImg(opt.image);

                          let cls = "bg-gray-100";
                          if (isChosen && isCorrectOpt)
                            cls = "bg-green-200 border border-green-400 text-gray-800";
                          else if (isChosen && !isCorrectOpt)
                            cls = "bg-red-200 border border-red-400 text-gray-800";
                          else if (isCorrectOpt)
                            cls = "bg-green-100 border border-green-300 text-gray-800";

                          return (
                            <div key={oi} className={`rounded-lg p-2.5 ${cls}`}>
                              <div className="flex items-start gap-2">
                                <span className="shrink-0 text-sm font-bold">
                                  {String.fromCharCode(65 + oi)}.
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="text-sm">{opt.text}</span>
                                  {optImgSrc && (
                                    <img
                                      src={optImgSrc}
                                      alt=""
                                      className="mt-1.5 max-h-16 max-w-[120px] rounded-lg border border-gray-200 bg-gray-50 object-contain"
                                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                  )}
                                </div>
                                <div className="shrink-0 text-[10px] font-bold">
                                  {isChosen && isCorrectOpt && <span className="text-green-700">Chosen &bull; Correct</span>}
                                  {isChosen && !isCorrectOpt && <span className="text-red-600">Chosen &bull; Wrong</span>}
                                  {!isChosen && isCorrectOpt && <span className="text-green-600">Correct Answer</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm">
                        {skipped ? (
                          <p className="italic text-gray-400">Not answered</p>
                        ) : (
                          <p>
                            Student answered:{" "}
                            <strong className={correct_ ? "text-green-700" : "text-red-600"}>
                              {Array.isArray(chosen) ? chosen.join(", ") : String(chosen)}
                            </strong>
                          </p>
                        )}
                        {correct !== null && correct !== undefined && (
                          <p className="text-blue-600">
                            Correct:{" "}
                            <strong>
                              {Array.isArray(correct) ? correct.join(", ") : String(correct)}
                            </strong>
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {editMode && (
            <div className="mt-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-amber-800">
                  New total: {newTotal} / {score.totalMarks} ({newPct}%)
                </p>
                <p className="text-xs text-amber-600">
                  Original: {score.marksObtained} marks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-600 disabled:opacity-50"
                >
                  <MdSave className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const TestMonitor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [scores, setScores] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedScore, setSelectedScore] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [testRes, scoresRes] = await Promise.all([
        fetch(`${BACKEND}/api/v1/test/get/test/bytestid/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
        fetch(`${BACKEND}/api/v1/score/get/scores/bytestid/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
      ]);

      let fetchedTest = null;
      if (testRes.ok) {
        const { test: t } = await testRes.json();
        fetchedTest = t;
        setTest(t);
      }

      if (scoresRes.ok) {
        const { scores: s = [] } = await scoresRes.json();
        setScores(s);
      }

      if (fetchedTest?.paperId) {
        try {
          const [qRes, paperRes] = await Promise.all([
            fetch(
              `${BACKEND}/api/v1/question/get/questions/bypaperid/${fetchedTest.paperId}`,
              { headers: { Authorization: "Bearer " + auth.token } }
            ),
            fetch(
              `${BACKEND}/api/v1/questionpaper/get/questionpaper/bypaperid/${fetchedTest.paperId}`
            ),
          ]);
          if (qRes.ok) {
            const { questions: qs = [] } = await qRes.json();
            setQuestions(qs);
          }
          if (paperRes.ok) {
            const { questionPaper } = await paperRes.json();
            setPaper(questionPaper);
          }
        } catch (_) {}
      }
    } catch {
      message.error("Failed to load test data");
    } finally {
      setLoading(false);
    }
  }, [testId, auth.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = scores.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.studentName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q)
    );
  });

  const totalAttempts = scores.length;
  const passed = scores.filter((s) => s.passed).length;
  const avgScore =
    totalAttempts > 0
      ? (
          scores.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0) /
          totalAttempts
        ).toFixed(1)
      : "---";
  const passRate =
    totalAttempts > 0 ? ((passed / totalAttempts) * 100).toFixed(0) : "---";

  const exportCSV = () => {
    const rows = [
      ["Student", "Student ID", "Marks", "Total", "%", "Result", "Date"],
    ];
    filtered.forEach((s) => {
      const pct =
        s.totalMarks > 0
          ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1)
          : "";
      rows.push([
        s.studentName,
        s.studentId,
        s.marksObtained,
        s.totalMarks,
        pct,
        s.passed ? "Pass" : "Fail",
        s.createdAt?.split("T")[0] || "",
      ]);
    });
    const csv = rows
      .map((r) => r.map((c) => `"${c ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${testId}-results.csv`;
    a.click();
  };

  const correctCount = (score) =>
    (score.questions || []).filter((sq) => sq.marksAwarded > 0).length;

  const wrongCount = (score) =>
    (score.questions || []).filter((sq) => sq.marksAwarded < 0).length;

  const skippedCount = (score) =>
    (score.questions || []).filter(
      (sq) =>
        sq.chosenAnswer === null ||
        sq.chosenAnswer === undefined ||
        (Array.isArray(sq.chosenAnswer) && sq.chosenAnswer.length === 0)
    ).length;

  const handleScoreSaved = (updatedScore) => {
    setScores((prev) =>
      prev.map((s) => (s._id === updatedScore._id ? updatedScore : s))
    );
    if (selectedScore?._id === updatedScore._id) {
      setSelectedScore(updatedScore);
    }
  };

  return (
    <div className="mt-3 space-y-4">
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              <MdArrowBack className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                {test?.testName || testId}
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Test ID: {testId}
                {test?.batchName && ` \u00b7 Batch: ${test.batchName}`}
                {test?.date && ` \u00b7 ${test.date}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-44 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
            </div>
            <button
              onClick={fetchData}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
              title="Refresh"
            >
              <MdRefresh className="h-4 w-4" />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-sm text-white transition hover:bg-green-600"
            >
              <MdDownload className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Submissions", value: totalAttempts, color: "text-blue-600" },
          { label: "Average Score", value: avgScore, color: "text-purple-600" },
          { label: "Passed", value: passed, color: "text-green-600" },
          {
            label: "Pass Rate",
            value: totalAttempts > 0 ? `${passRate}%` : "---",
            color: "text-amber-600",
          },
        ].map((s) => (
          <Card key={s.label} extra="p-4">
            <p className="mb-1 text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card extra="w-full p-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {scores.length === 0
              ? "No submissions yet for this test."
              : "No results match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    "#",
                    "Student",
                    "Student ID",
                    "Marks",
                    "%",
                    "Correct",
                    "Wrong",
                    "Skipped",
                    "Result",
                    "Submitted",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`pb-2.5 pr-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                        ["Marks", "%", "Correct", "Wrong", "Skipped"].includes(h)
                          ? "text-right"
                          : h === "Result"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const pct =
                    s.totalMarks > 0
                      ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1)
                      : null;
                  const cCount = correctCount(s);
                  const wCount = wrongCount(s);
                  const skCount = skippedCount(s);

                  return (
                    <tr
                      key={s._id || i}
                      className="border-b border-gray-50 transition hover:bg-gray-50"
                    >
                      <td className="py-2.5 pr-4 text-xs text-gray-400">{i + 1}</td>
                      <td className="py-2.5 pr-4 text-sm font-medium text-navy-700">
                        {s.studentName || "---"}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-500">{s.studentId}</td>
                      <td className="py-2.5 pr-4 text-right text-sm font-bold text-navy-700">
                        {s.marksObtained}
                        <span className="font-normal text-gray-400">/{s.totalMarks}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-right text-sm text-gray-500">
                        {pct ? `${pct}%` : "---"}
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <span className="text-xs font-bold text-green-600">{cCount}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <span className="text-xs font-bold text-red-500">{wCount}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <span className="text-xs font-bold text-gray-400">{skCount}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            s.passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {s.passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-[11px] text-gray-400">
                        {s.createdAt ? new Date(s.createdAt).toLocaleString() : "---"}
                      </td>
                      <td className="py-2.5">
                        <button
                          onClick={() => setSelectedScore(s)}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 transition hover:bg-blue-100"
                        >
                          <MdEdit className="h-3 w-3" /> View & Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedScore && (
        <AnswerSheetModal
          score={selectedScore}
          questions={questions}
          paper={paper}
          onClose={() => setSelectedScore(null)}
          onSaved={handleScoreSaved}
        />
      )}
    </div>
  );
};

export default TestMonitor;