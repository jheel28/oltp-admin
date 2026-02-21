import React, { useContext, useEffect, useState } from "react";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { useParams } from "react-router-dom";

const StudentResultsTable = () => {
  const [student, setStudent] = useState({});
  const [score, setScore] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionPaper, setQuestionPaper] = useState({});
  const auth = useContext(AuthContext);
  const { testId, paperId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/student/byid/${auth.userId}`
        );
        if (!studentResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentResponse.status}`);
        }
        const studentData = await studentResponse.json();
        setStudent(studentData.student);

        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/score/bytestid/${testId}/studentid/${studentData.student.studentId}`
        );
        if (!scoreResponse.ok) {
          throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
        }
        const scoreData = await scoreResponse.json();
        setScore(scoreData.score);

        const questionsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/bypaperid/${paperId}`
        );
        if (!questionsResponse.ok) {
          throw new Error(`HTTP error! Status: ${questionsResponse.status}`);
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData.questions);

        const questionPaperResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/bypaperid/${paperId}`
        );
        if (!questionPaperResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${questionPaperResponse.status}`
          );
        }
        const questionPaperData = await questionPaperResponse.json();
        setQuestionPaper(questionPaperData.questionPaper);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [auth.userId, testId, paperId]);

  const renderOptions = (questionId) => {
    if (!score || !score.questions || !score.questions.length === 0)
      return null;

    const scoreQuestion = score.questions.find(
      (q) => q.questionId === questionId.questionId
    );

    if (!scoreQuestion) return null;

    const question = questions.find((q) => q._id === scoreQuestion.questionId);

    if (!question) return null;

    return (
      <div className="mb-4">
        Options:
        {question.options.map((option, optionIndex) => {
          return (
            <div
              key={optionIndex}
              className={`mb-2 rounded-lg border p-2 ${
                scoreQuestion.chosenAnswer == optionIndex
                  ? scoreQuestion.correctAnswer == optionIndex
                    ? "bg-green-200 dark:text-gray-800"
                    : "bg-red-200 dark:text-gray-800"
                  : "bg-gray-200 dark:text-gray-800"
              }`}
            >
              <strong>Option {optionIndex + 1}:</strong> {option.text}{" "}
              {scoreQuestion.chosenAnswer == optionIndex &&
                scoreQuestion.correctAnswer == optionIndex && (
                  <span className="ml-2 text-green-600">Correct (Chosen)</span>
                )}
              {scoreQuestion.chosenAnswer == optionIndex &&
                scoreQuestion.correctAnswer != optionIndex && (
                  <span className="ml-2 text-red-600">Chosen</span>
                )}
              {scoreQuestion.chosenAnswer != optionIndex &&
                scoreQuestion.correctAnswer == optionIndex && (
                  <span className="ml-2 text-green-600">Correct</span>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Tests Results
        </div>
      </header>
      <div>
        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <ul>
            {questions &&
              questions.map((question, index) => (
                <li key={index}>
                  <div className="mb-4 rounded-lg border p-3">
                    <div className="mb-6 rounded border bg-gray-300 p-2 font-bold dark:text-gray-800">
                      Question: {question.text}
                    </div>
                    {question.questionImage && (
                      <div className="mb-6 rounded border bg-gray-300 p-2 font-bold dark:text-gray-800">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}/${question.questionImage}`}
                          alt="question"
                        />
                      </div>
                    )}
                    {score && renderOptions(score.questions[index])}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default StudentResultsTable;