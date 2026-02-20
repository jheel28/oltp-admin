import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "components/Auth-context";
import Card from "components/card";
import {
  MdOutlineCheckCircle, MdOutlineCancel, MdOutlineRemoveCircle,
  MdHome, MdOutlineBarChart,
} from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";

const CircleProgress = ({ value, size = 120, stroke = 10, color }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
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

  const grade = percentage >= 90 ? { label: "Exceptional", color: "#10B981" } :
    percentage >= 75 ? { label: "Excellent", color: "#3B82F6" } :
    percentage >= 60 ? { label: "Good", color: "#8B5CF6" } :
    percentage >= 40 ? { label: "Average", color: "#F59E0B" } :
    { label: "Needs Improvement", color: "#EF4444" };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/score/bystudentid/${auth.userId}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const data = await res.json();
        const scores = data.scores || [];
        // Get most recent
        const latest = scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setLatestScore(latest);

        // Fetch question details if available
        if (latest?.questionPaperId) {
          const qRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/byquestionpaperid/${latest.questionPaperId}`
          );
          const qData = await qRes.json();
          setQuestions(qData.questions || []);
        }
      } catch {
        // Fail silently — we still show score from URL params
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [auth.userId, auth.token]);

  const questionResults = latestScore?.questions || [];

  const correct = questionResults.filter((q) => {
    const chosen = q.chosenAnswer;
    const correct = q.correctAnswer;
    if (chosen === null || chosen === undefined) return false;
    if (Array.isArray(correct)) {
      const ca = Array.isArray(chosen) ? chosen : [chosen];
      return ca.length === correct.length && ca.every((v) => correct.includes(v));
    }
    const ca = Array.isArray(chosen) ? chosen : [chosen];
    return ca.includes(correct);
  }).length;

  const unanswered = questionResults.filter((q) =>
    q.chosenAnswer === null || q.chosenAnswer === undefined ||
    (Array.isArray(q.chosenAnswer) && q.chosenAnswer.length === 0)
  ).length;

  const wrong = questionResults.length - correct - unanswered;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#1a2744] px-6 py-4 text-white text-center">
        <div className="text-lg font-black">Exam Completed</div>
        <div className="text-xs text-blue-300">{latestScore?.testName || "Your Results"}</div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-5">
        {/* Main score card */}
        <Card extra="p-8 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <CircleProgress value={percentage} size={140} stroke={12} color={grade.color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-navy-700">{percentage}%</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black mb-4"
            style={{ backgroundColor: grade.color + "20", color: grade.color }}>
            {percentage >= 60 ? <IoTrophyOutline /> : null}
            {grade.label}
          </div>

          <h2 className="text-2xl font-black text-navy-700 mb-1">
            {earned} / {total}
          </h2>
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

        {/* Detailed breakdown toggle */}
        {questionResults.length > 0 && questions.length > 0 && (
          <Card extra="p-5">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-black text-navy-700 flex items-center gap-2">
                <MdOutlineBarChart className="text-blue-500" /> Question-wise Analysis
              </h3>
              <span className="text-xs font-bold text-blue-500">{showDetails ? "Hide" : "Show"}</span>
            </button>

            {showDetails && (
              <div className="mt-4 space-y-2">
                {questionResults.map((qr, i) => {
                  const q = questions.find((x) => x._id === qr.questionId);
                  const chosen = qr.chosenAnswer;
                  const correctAns = qr.correctAnswer;
                  const skipped = chosen === null || chosen === undefined ||
                    (Array.isArray(chosen) && chosen.length === 0);
                  let isCorrect = false;
                  if (!skipped) {
                    if (Array.isArray(correctAns)) {
                      const ca = Array.isArray(chosen) ? chosen : [chosen];
                      isCorrect = ca.length === correctAns.length && ca.every((v) => correctAns.includes(v));
                    } else {
                      const ca = Array.isArray(chosen) ? chosen : [chosen];
                      isCorrect = ca.includes(correctAns);
                    }
                  }
                  const status = skipped ? "skipped" : isCorrect ? "correct" : "wrong";
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

                  return (
                    <div key={i} className={`rounded-xl border p-3 ${statusStyle}`}>
                      <div className="flex items-start gap-3">
                        <span className={`flex-shrink-0 h-6 w-6 rounded-full text-xs font-black flex items-center justify-center ${badge}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 leading-relaxed">
                            {q?.text || `Question ${i + 1}`}
                          </p>
                          {!skipped && !isCorrect && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">
                              Correct: Option {Array.isArray(correctAns) ? correctAns.map((v) => String.fromCharCode(65 + v)).join(", ") : String.fromCharCode(65 + correctAns)}
                            </p>
                          )}
                        </div>
                        <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          status === "correct" ? "bg-green-100 text-green-700" :
                          status === "wrong" ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-500"
                        }`}>{status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/student/default")}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <MdHome /> Dashboard
          </button>
          <button onClick={() => navigate("/student/results")}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
            <MdOutlineBarChart /> View All Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;