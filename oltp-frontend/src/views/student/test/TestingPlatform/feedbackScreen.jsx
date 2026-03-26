import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "components/Auth-context";
import Card from "components/card";
import {
  MdOutlineCheckCircle, MdOutlineCancel, MdOutlineRemoveCircle,
  MdHome, MdOutlineBarChart,
} from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";

const BACKEND = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

const imgSrc = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const CircleProgress = ({ value, size = 120, stroke = 10, color }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

const isResultCorrect = (qr, question) => {
  const chosen = qr.chosenAnswer;
  const correct = qr.correctAnswer;
  if (chosen === null || chosen === undefined) return false;

  if (question?.type === "NAT" || (correct && typeof correct === "object" && !Array.isArray(correct))) {
    const val = parseFloat(chosen);
    const cObj = correct;
    if (cObj?.min != null && cObj?.max != null)
      return !isNaN(val) && val >= parseFloat(cObj.min) && val <= parseFloat(cObj.max);
    return String(chosen) === String(correct);
  }

  if (Array.isArray(correct)) {
    const chosenArr = (Array.isArray(chosen) ? chosen : [chosen]).map(Number);
    const correctArr = correct.map(Number);
    return chosenArr.length === correctArr.length && chosenArr.every((c) => correctArr.includes(c));
  }

  const chosenVal = Array.isArray(chosen) ? chosen[0] : chosen;
  return String(chosenVal) === String(correct);
};

const isSkipped = (qr) =>
  qr.chosenAnswer === null ||
  qr.chosenAnswer === undefined ||
  (Array.isArray(qr.chosenAnswer) && qr.chosenAnswer.length === 0);

const QuestionReview = ({ qr, question, index }) => {
  const skipped = isSkipped(qr);
  const correct = !skipped && isResultCorrect(qr, question);
  const status = skipped ? "skipped" : correct ? "correct" : "wrong";

  const statusStyle = {
    correct: "border-green-200 bg-green-50",
    wrong: "border-red-200 bg-red-50",
    skipped: "border-gray-200 bg-gray-50",
  }[status];

  const badge = {
    correct: "bg-green-500 text-white",
    wrong: "bg-red-500 text-white",
    skipped: "bg-gray-300 text-gray-600",
  }[status];

  const statusPill = {
    correct: "bg-green-100 text-green-700",
    wrong: "bg-red-100 text-red-600",
    skipped: "bg-gray-100 text-gray-500",
  }[status];

  const chosen = qr.chosenAnswer;
  const correctAns = qr.correctAnswer;

  const chosenIdxArr = Array.isArray(chosen)
    ? chosen.map(Number)
    : chosen !== null && chosen !== undefined ? [Number(chosen)] : [];

  const correctIdxArr = Array.isArray(correctAns)
    ? correctAns.map(Number)
    : correctAns !== null && correctAns !== undefined && typeof correctAns !== "object"
    ? [Number(correctAns)] : [];

  const isNAT = question?.type === "NAT" ||
    (correctAns && typeof correctAns === "object" && !Array.isArray(correctAns));

  const qImg = imgSrc(question?.questionImage);

  return (
    <div className={`rounded-xl border p-3 ${statusStyle}`}>
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 h-6 w-6 rounded-full text-xs font-black flex items-center justify-center ${badge}`}>
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 leading-relaxed">
            {question?.text || `Question ${index + 1}`}
          </p>

          {qImg && (
            <img
              src={qImg}
              alt="question"
              className="mt-1.5 max-h-24 max-w-[180px] object-contain rounded-lg border border-gray-200 bg-gray-50"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}

          {isNAT && (
            <div className="mt-2 text-xs text-gray-600">
              {skipped ? (
                <span className="text-gray-400 italic">Not answered</span>
              ) : (
                <span>Your answer: <strong>{String(chosen)}</strong></span>
              )}
              {!correct && !skipped && correctAns && typeof correctAns === "object" && (
                <span className="ml-2 text-teal-600">
                  · Correct range: <strong>{correctAns.min} – {correctAns.max}</strong>
                </span>
              )}
            </div>
          )}

          {!isNAT && question?.options?.length > 0 && (
            <div className="mt-2 space-y-1">
              {question.options.map((opt, oi) => {
                const isChosenOpt = chosenIdxArr.includes(oi);
                const isCorrectOpt = correctIdxArr.includes(oi);
                const cls =
                  isChosenOpt && isCorrectOpt ? "border-green-400 bg-green-100" :
                  isChosenOpt ? "border-red-400 bg-red-100" :
                  isCorrectOpt && !skipped ? "border-green-300 bg-green-50" :
                  isCorrectOpt && skipped ? "border-teal-300 bg-teal-50" :
                  "border-gray-200 bg-white";

                const optImg = imgSrc(opt.image);

                return (
                  <div key={oi} className={`flex items-start gap-2 rounded-lg border px-2 py-1.5 text-[11px] ${cls}`}>
                    <span className="font-black flex-shrink-0 text-gray-500 w-4">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-gray-700">{opt.text}</span>
                      {optImg && (
                        <img
                          src={optImg}
                          alt=""
                          className="mt-1.5 max-h-16 max-w-[120px] object-contain rounded border border-gray-200"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                    </div>
                    <span className="ml-auto flex-shrink-0 text-[10px] font-bold">
                      {isChosenOpt && isCorrectOpt && <span className="text-green-700">✓ Chosen</span>}
                      {isChosenOpt && !isCorrectOpt && <span className="text-red-600">✗ Chosen</span>}
                      {!isChosenOpt && isCorrectOpt && <span className="text-green-700">✓ Correct</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusPill}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const FeedbackScreen = () => {
  const { score, maxscore } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [latestScore, setLatestScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const earned = parseFloat(score) || 0;
  const total = parseFloat(maxscore) || 0;
  const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;

  const grade =
    percentage >= 90 ? { label: "Exceptional", color: "#10B981" } :
    percentage >= 75 ? { label: "Excellent", color: "#3B82F6" } :
    percentage >= 60 ? { label: "Good", color: "#8B5CF6" } :
    percentage >= 40 ? { label: "Average", color: "#F59E0B" } :
    { label: "Needs Improvement", color: "#EF4444" };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const studentRes = await fetch(
          `${BACKEND}/api/v1/student/get/student/byid/${auth.userId}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const { student } = await studentRes.json();
        if (!student?.studentId) { setLoading(false); return; }

        const scoresRes = await fetch(
          `${BACKEND}/api/v1/score/get/scores/bystudentid/${student.studentId}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const { scores = [] } = await scoresRes.json();
        const latest = [...scores].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setLatestScore(latest);

        if (latest?.paperId) {
          const qRes = await fetch(
            `${BACKEND}/api/v1/question/get/questions/bypaperid/${latest.paperId}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          );
          const { questions: qs = [] } = await qRes.json();
          setQuestions(qs);
        }
      } catch (err) {
        console.error("FeedbackScreen fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [auth.userId, auth.token]);

  const questionResults = latestScore?.questions || [];

  const correct = questionResults.filter((qr) => {
    const q = questions.find((x) => String(x._id) === String(qr.questionId));
    return !isSkipped(qr) && isResultCorrect(qr, q);
  }).length;
  const unanswered = questionResults.filter(isSkipped).length;
  const wrong = questionResults.length - correct - unanswered;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-cyan-900 px-6 py-4 text-white text-center">
        <div className="text-lg font-black">Exam Completed</div>
        <div className="text-xs text-teal-300">{latestScore?.testName || "Your Results"}</div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
        <Card extra="p-8 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <CircleProgress value={percentage} size={140} stroke={12} color={grade.color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-navy-700">{percentage}%</span>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black mb-4"
            style={{ backgroundColor: grade.color + "20", color: grade.color }}
          >
            {percentage >= 60 && <IoTrophyOutline />}
            {grade.label}
          </div>

          <h2 className="text-2xl font-black text-navy-700 mb-1">{earned} / {total}</h2>
          <p className="text-sm text-gray-400">marks obtained</p>

          {questionResults.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { v: correct, l: "Correct", icon: <MdOutlineCheckCircle />, c: "text-green-600 bg-green-50" },
                { v: wrong, l: "Wrong", icon: <MdOutlineCancel />, c: "text-red-500 bg-red-50" },
                { v: unanswered, l: "Skipped", icon: <MdOutlineRemoveCircle />, c: "text-gray-400 bg-gray-50" },
              ].map((s) => (
                <div key={s.l} className={`rounded-xl p-3 ${s.c}`}>
                  <div className={`text-xl mb-0.5 ${s.c.split(" ")[0]}`}>{s.icon}</div>
                  <p className="text-xl font-black">{s.v}</p>
                  <p className="text-[10px] font-bold uppercase opacity-60">{s.l}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {questionResults.length > 0 && (
          <Card extra="p-5">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-black text-navy-700 flex items-center gap-2">
                <MdOutlineBarChart className="text-teal-500" /> Question-wise Analysis
              </h3>
              <span className="text-xs font-bold text-teal-500">{showDetails ? "Hide" : "Show"}</span>
            </button>

            {showDetails && !loading && (
              <div className="mt-4 space-y-3">
                {questionResults.map((qr, i) => {
                  const question = questions.find((x) => String(x._id) === String(qr.questionId));
                  return <QuestionReview key={i} qr={qr} question={question} index={i} />;
                })}
              </div>
            )}
            {showDetails && loading && (
              <div className="mt-4 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
              </div>
            )}
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/student/default")}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <MdHome /> Dashboard
          </button>
          <button
            onClick={() => navigate("/student/result")}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-500 shadow-lg shadow-teal-200"
          >
            <MdOutlineBarChart /> View All Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;