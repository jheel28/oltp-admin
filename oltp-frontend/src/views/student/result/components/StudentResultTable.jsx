import React, { useContext, useEffect, useState } from "react";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const normImg = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const isCorrect = (scoreQ, question) => {
  const chosen = scoreQ.chosenAnswer;
  const correct = scoreQ.correctAnswer;
  if (chosen === null || chosen === undefined) return false;

  if (question?.type === "NAT" || (correct && typeof correct === "object" && !Array.isArray(correct))) {
    const val = parseFloat(chosen);
    return !isNaN(val) && val >= parseFloat(correct?.min) && val <= parseFloat(correct?.max);
  }
  if (Array.isArray(correct)) {
    const ca = (Array.isArray(chosen) ? chosen : [chosen]).map(Number);
    const co = correct.map(Number);
    return ca.length === co.length && ca.every((v) => co.includes(v));
  }
  const chosenVal = Array.isArray(chosen) ? chosen[0] : chosen;
  return String(chosenVal) === String(correct);
};

const OptionRow = ({ opt, oi, isChosenOpt, isCorrectOpt }) => {
  let cls = "bg-gray-100 dark:bg-navy-700 dark:text-gray-200";
  if (isChosenOpt && isCorrectOpt) cls = "bg-green-200 border border-green-400 dark:text-gray-800";
  else if (isChosenOpt && !isCorrectOpt) cls = "bg-red-200 border border-red-400 dark:text-gray-800";
  else if (isCorrectOpt) cls = "bg-green-100 border border-green-300 dark:text-gray-800";

  const optImgSrc = normImg(opt.image);

  return (
    <div className={`rounded-lg p-2.5 ${cls}`}>
      <div className="flex items-start gap-2">
        <span className="font-bold text-sm flex-shrink-0">{String.fromCharCode(65 + oi)}.</span>
        <div className="min-w-0 flex-1">
          <span className="text-sm">{opt.text}</span>
          {optImgSrc && (
            <img
              src={optImgSrc}
              alt=""
              className="mt-1.5 max-h-20 max-w-[140px] object-contain rounded-lg border border-gray-200 bg-gray-50"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
        </div>
        <div className="flex-shrink-0 text-xs font-semibold">
          {isChosenOpt && isCorrectOpt && <span className="text-green-700">✓ Correct (Chosen)</span>}
          {isChosenOpt && !isCorrectOpt && <span className="text-red-600">✗ Wrong (Chosen)</span>}
          {!isChosenOpt && isCorrectOpt && <span className="text-green-600">✓ Correct Answer</span>}
        </div>
      </div>
    </div>
  );
};

const QuestionResult = ({ question, scoreQ, index }) => {
  if (!scoreQ) return null;

  const chosen = scoreQ.chosenAnswer;
  const correct = scoreQ.correctAnswer;
  const skipped = chosen === null || chosen === undefined ||
    (Array.isArray(chosen) && chosen.length === 0);
  const correct_ = !skipped && isCorrect(scoreQ, question);

  const isNAT = question?.type === "NAT" ||
    (correct && typeof correct === "object" && !Array.isArray(correct));

  const chosenArr = Array.isArray(chosen)
    ? chosen.map(Number)
    : chosen !== null && chosen !== undefined
    ? [Number(chosen)] : [];

  const correctArr = Array.isArray(correct)
    ? correct.map(Number)
    : !isNAT && correct !== null && correct !== undefined
    ? [Number(correct)] : [];

  const statusCls = skipped
    ? "border-gray-200 bg-gray-50"
    : correct_
    ? "border-green-200 bg-green-50"
    : "border-red-200 bg-red-50";

  const qImgSrc = normImg(question?.questionImage);

  return (
    <li className={`rounded-xl border p-4 ${statusCls}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase text-gray-400 mr-2">Q{index + 1}</span>
          <span className="text-sm font-semibold text-navy-700 dark:text-white">
            {question?.text || `Question ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            skipped ? "bg-gray-100 text-gray-500" :
            correct_ ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {skipped ? "Skipped" : correct_ ? "Correct" : "Wrong"}
          </span>
          <span className={`text-xs font-bold ${
            scoreQ.marksAwarded > 0 ? "text-green-600" :
            scoreQ.marksAwarded < 0 ? "text-red-500" : "text-gray-400"
          }`}>
            {scoreQ.marksAwarded > 0 ? `+${scoreQ.marksAwarded}` : scoreQ.marksAwarded}
          </span>
        </div>
      </div>

      {qImgSrc && (
        <img
          src={qImgSrc}
          alt="question"
          className="mb-3 max-h-48 max-w-full object-contain rounded-lg border border-gray-200 bg-gray-50"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}

      {/* NAT answer */}
      {isNAT && (
        <div className="space-y-1.5">
          {skipped ? (
            <p className="text-sm italic text-gray-400">Not answered</p>
          ) : (
            <p className="text-sm">
              Your answer: <strong className={correct_ ? "text-green-700" : "text-red-600"}>{String(chosen)}</strong>
            </p>
          )}
          {!correct_ && correct && typeof correct === "object" && (
            <p className="text-sm text-blue-600">
              Correct range: <strong>{correct.min} – {correct.max}</strong>
            </p>
          )}
        </div>
      )}

      {/* MCQ/MSQ options */}
      {!isNAT && question?.options?.length > 0 && (
        <div className="space-y-1.5">
          {question.options.map((opt, oi) => (
            <OptionRow
              key={oi}
              opt={opt}
              oi={oi}
              isChosenOpt={chosenArr.includes(oi)}
              isCorrectOpt={correctArr.includes(oi)}
            />
          ))}
        </div>
      )}
    </li>
  );
};

const StudentResultsTable = () => {
  const [student, setStudent] = useState(null);
  const [scoreRecord, setScoreRecord] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const { testId, paperId, scoreId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentRes = await fetch(
          `${BACKEND}/api/v1/student/get/student/byid/${auth.userId}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const { student: s } = await studentRes.json();
        setStudent(s);

        let score;
        if (scoreId) {
          // Fetch specific score by its _id
          const scoreRes = await fetch(
            `${BACKEND}/api/v1/score/get/score/byid/${scoreId}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          );
          const data = await scoreRes.json();
          score = data.score;
        } else {
          // Legacy: fetch by testId + studentId
          const scoreRes = await fetch(
            `${BACKEND}/api/v1/score/get/score/bytestid/${testId}/studentid/${s.studentId}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          );
          const data = await scoreRes.json();
          score = data.score;
        }

        setScoreRecord(score);

        // Fetch questions using paperId from score or from URL param
        const pid = score?.paperId || paperId;
        if (pid) {
          const questionsRes = await fetch(
            `${BACKEND}/api/v1/question/get/questions/bypaperid/${pid}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          );
          const { questions: qs = [] } = await questionsRes.json();
          setQuestions(qs);
        }
      } catch (err) {
        console.error("StudentResultsTable error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth.userId, auth.token, testId, paperId, scoreId]);

  if (loading) {
    return (
      <Card extra="w-full p-12 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </Card>
    );
  }

  const summary = scoreRecord
    ? { marks: scoreRecord.marksObtained, total: scoreRecord.totalMarks, passed: scoreRecord.passed }
    : null;

  const scoreQuestions = scoreRecord?.questions || [];
  const displayItems = scoreQuestions.map((sq) => ({
    scoreQ: sq,
    question: questions.find((q) => String(q._id) === String(sq.questionId)),
  }));

  const fallbackItems = displayItems.length === 0
    ? questions.map((q) => ({ question: q, scoreQ: null }))
    : displayItems;

  const pct = summary && summary.total > 0
    ? Math.round((summary.marks / summary.total) * 100)
    : 0;

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
          <MdArrowBack className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Test Results</h2>
          {summary && (
            <p className="text-sm text-gray-500">
              {summary.marks} / {summary.total} marks ·{" "}
              <span className={`font-bold ${summary.passed ? "text-green-600" : "text-red-500"}`}>
                {pct}% — {summary.passed ? "Passed" : "Failed"}
              </span>
            </p>
          )}
        </div>
      </header>

      {!scoreRecord ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">No score record found for this test.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {fallbackItems.map(({ question, scoreQ }, index) => (
            <QuestionResult
              key={scoreQ?.questionId || index}
              question={question}
              scoreQ={scoreQ}
              index={index}
            />
          ))}
        </ul>
      )}
    </Card>
  );
};

export default StudentResultsTable;