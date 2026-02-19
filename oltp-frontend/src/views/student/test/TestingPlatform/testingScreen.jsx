import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { IoMdAlarm } from "react-icons/io";
import { message, Watermark } from "antd";
import { AuthContext } from "components/Auth-context";

const TestingScreen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitConfirmation, setSubmitConfirmation] = useState(false);

  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [optionIndex, setOptionIndex] = useState(
    Array(questions.length).fill(null)
  );
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [test, setTest] = useState({});
  const [student, setStudent] = useState({});
  const [remainingTime, setRemainingTime] = useState(0); // Initialize with 0
  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/test/byid/${id}`
        );
        if (!testResponse.ok) {
          throw new Error(`HTTP error! Status: ${testResponse.status}`);
        }
        const testData = await testResponse.json();
        setTest(testData.test);

        // --- DYNAMIC TIMER CALCULATION ---
        const endTime = new Date(
          `${testData.test.date} ${testData.test.endTime}`
        );
        const currentTime = new Date();
        const differenceInSeconds = Math.max(
          0,
          Math.floor((endTime.getTime() - currentTime.getTime()) / 1000)
        );

        setRemainingTime(differenceInSeconds);

        const questionsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/byquestionpaperid/${testData.test.questionPaperId}`
        );
        if (!questionsResponse.ok) {
          throw new Error(`HTTP error! Status: ${questionsResponse.status}`);
        }
        const questionsData = await questionsResponse.json();
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/student/byid/${auth.userId}`
        );
        if (!studentResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentResponse.status}`);
        }
        const studentData = await studentResponse.json();
        setStudent(studentData.student);
        if (questionsData.questions.length === 0) {
          message.warning("No questions found for this test.");
        }
        setQuestions(questionsData.questions);
        setOptionIndex(Array(questionsData.questions.length).fill(null));
        setSelectedOptions(Array(questionsData.questions.length).fill(null));
        setVisitedQuestions(Array(questionsData.questions.length).fill(false)); // Initialize visitedQuestions here
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error while fetching data");
      }
    };

    fetchTestAndQuestions();
  }, []);

  useEffect(() => {
    if (remainingTime <= 0 && questions.length > 0) {
      handleConfirmSubmission();
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prevTime === 301) {
          message.warning("5 minutes remaining!");
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, questions.length]);

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleOptionSelect = (optionId, questionIndex, index) => {
    setOptionIndex((prev) => {
      const updated = [...prev];
      const isMSQ = Array.isArray(questions[questionIndex].correctOption);
      const currentSelection = Array.isArray(updated[questionIndex])
        ? updated[questionIndex]
        : [];

      if (isMSQ) {
        if (currentSelection.includes(index)) {
          updated[questionIndex] = currentSelection.filter((i) => i !== index);
        } else {
          updated[questionIndex] = [...currentSelection, index];
        }
      } else {
        // Simple select for Single Select MCQ
        updated[questionIndex] = [index];
      }
      return updated;
    });

    setVisitedQuestions((prev) => {
      const updated = [...prev];
      updated[questionIndex] = true;
      return updated;
    });
  };

  const handleTestSubmission = () => {
    setSubmitConfirmation(true);
  };

  const handleClearOptions = () => {
    const updatedOptionIndex = [...optionIndex];
    updatedOptionIndex[currentQuestion] = Array.isArray(
      questions[currentQuestion].correctOption
    )
      ? []
      : null;
    setOptionIndex(updatedOptionIndex);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      const chosen = optionIndex[index];
      const correct = question.correctOption;

      if (question.type === "Numerical") {
        if (parseFloat(chosen) === correct) {
          score += question.marks;
        }
      } else {
        // MCQ (could be single or multiple)
        if (Array.isArray(correct)) {
          // MSQ logic: must match exactly
          if (
            Array.isArray(chosen) &&
            chosen.length === correct.length &&
            chosen.every((val) => correct.includes(val))
          ) {
            score += question.marks;
          }
        } else {
          // Single select fallback
          if (chosen === correct) {
            score += question.marks;
          }
        }
      }
    });
    return score;
  };

  const handleConfirmSubmission = async () => {
    // Calculate the score
    const score = calculateScore();
    const maxscore = test.score;

    // Check if studentId, testId, and questionPaperId are not undefined
    if (student.studentId && test.testId && test.questionPaperId) {
      try {
        const data = {
          marks: score,
          studentId: student.studentId,
          testId: test.testId,
          questionPaperId: test.questionPaperId,
          maxscore: maxscore,
          questions: questions.map((question, index) => ({
            questionId: question._id,
            correctAnswer: question.correctOption,
            chosenAnswer: optionIndex[index],
          })),
        };
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/create/score`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Something went wrong while submitting the test");
        }
        message.success("Successfully submitted the test");

        // Navigate to the result screen with the score
        navigate(`/student/feedbackscreen/${score}/${maxscore}`);
      } catch (err) {
        message.error("Something went wrong while submitting the test");
      }
    } else {
      // Handle the case where studentId, testId, or questionPaperId is undefined
      console.error("studentId, testId, or questionPaperId is undefined");
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Questions... or No Questions Available
      </div>
    );
  }

  return (
    <Watermark
      content={`${"The Correct Steps"} - Testid:${test.testId}`}
      gap={[100, 100]}
      offset={[50, 50]}
    >
      <div className="relative flex min-h-screen flex-col items-center bg-gray-50/50 text-navy-700">
        <div className="mb-6 mt-0 w-full bg-blue-600 py-4 text-center text-2xl font-bold text-white shadow-md">
          <h1>The Correct Steps Online Testing Platform</h1>
        </div>

        {!submitConfirmation ? (
          <div className="flex w-full max-w-[1600px] flex-col px-4 pb-24 lg:flex-row">
            <div className="mb-8 flex-1 lg:mb-0 lg:pr-8">
              {/* Left side area for questions and options */}
              {questions.length > 0 && (
                <div className="mb-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                    </div>

                    <h3 className="mb-8 text-xl font-bold leading-relaxed text-navy-700">
                      {questions[currentQuestion].text}
                    </h3>

                    {questions[currentQuestion].questionImage && (
                      <div className="mb-8 flex justify-center rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}/${questions[currentQuestion].questionImage}`}
                          alt="Question"
                          className="max-w-full rounded-xl shadow-sm"
                          style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      {questions[currentQuestion].type === "Numerical" ? (
                        <div className="mb-4">
                          <p className="mb-3 font-semibold text-gray-600">
                            Enter your answer:
                          </p>
                          <input
                            type="number"
                            step="any"
                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 text-lg font-bold text-navy-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            placeholder="0.00"
                            value={
                              optionIndex[currentQuestion] !== null
                                ? optionIndex[currentQuestion]
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              setOptionIndex((prev) => {
                                const updated = [...prev];
                                updated[currentQuestion] = val;
                                return updated;
                              });
                              setVisitedQuestions((prev) => {
                                const updated = [...prev];
                                updated[currentQuestion] = true;
                                return updated;
                              });
                            }}
                          />
                        </div>
                      ) : (
                        questions[currentQuestion].options.map(
                          (option, index) => {
                            const isSelected =
                              Array.isArray(optionIndex[currentQuestion]) &&
                              optionIndex[currentQuestion].includes(index);
                            return (
                              <div
                                key={option._id}
                                className={`flex cursor-pointer items-center rounded-xl border-2 p-5 transition-all duration-200 ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  handleOptionSelect(
                                    option._id,
                                    currentQuestion,
                                    index
                                  )
                                }
                              >
                                <div
                                  className={`mr-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200"
                                      : "border-gray-200 bg-gray-50 text-gray-400"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span
                                  className={`text-base font-semibold ${
                                    isSelected
                                      ? "text-blue-700"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option.text}
                                </span>
                              </div>
                            );
                          }
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-gray-100 bg-white/80 px-8 py-4 shadow-lg backdrop-blur-md lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)]">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50"
                >
                  <AiOutlineArrowLeft className="mr-2" />
                  Previous
                </button>
                <button
                  onClick={handleClearOptions}
                  className="border-transparent rounded-xl border bg-gray-100 px-6 py-3 font-bold text-red-500 transition-all hover:border-red-100 hover:bg-red-50"
                >
                  Clear Response
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50"
                >
                  Next
                  <AiOutlineArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Right side area for student info, timer, and question tiles */}
            <div className="w-full space-y-6 lg:w-[350px] xl:w-[400px]">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center space-x-4 border-b border-gray-50 pb-6">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`}
                    alt="Student"
                    className="rounded-2xl border-2 border-blue-100"
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p className="text-lg font-bold text-navy-700">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {student.studentId}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">Test Name</span>
                    <span className="font-bold text-navy-700">
                      {test.examName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">Duration</span>
                    <span className="font-bold text-navy-700">
                      {test.duration} mins
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Time Remaining
                    </span>
                    <div
                      className={`text-2xl font-black tabular-nums ${
                        remainingTime < 300 ? "text-red-500" : "text-blue-600"
                      }`}
                    >
                      {Math.floor(remainingTime / 60)
                        .toString()
                        .padStart(2, "0")}
                      :{(remainingTime % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                  Question Palette
                </h3>
                <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-5 gap-3">
                    {questions.map((question, index) => {
                      const isAnswered = Array.isArray(optionIndex[index])
                        ? optionIndex[index].length > 0
                        : optionIndex[index] !== null &&
                          optionIndex[index] !== "";
                      const isVisited = visitedQuestions[index];

                      let statusClasses =
                        "bg-gray-50 text-gray-400 border-gray-100";
                      if (currentQuestion === index)
                        statusClasses =
                          "bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-50";
                      else if (isAnswered)
                        statusClasses =
                          "bg-green-500 text-white border-green-500";
                      else if (isVisited)
                        statusClasses = "bg-red-500 text-white border-red-500";

                      return (
                        <div
                          key={question._id}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-200 ${statusClasses}`}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          {index + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-50 pt-6">
                  <button
                    onClick={handleTestSubmission}
                    className="w-full rounded-xl bg-red-500 py-4 font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-100"
                  >
                    Submit Final Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <IoMdAlarm className="h-10 w-10 animate-pulse text-red-500" />
            </div>
            <h2 className="mb-2 text-3xl font-black text-navy-700">
              Final Submission
            </h2>
            <p className="mb-8 max-w-sm text-gray-500">
              Are you sure you want to end your exam? You won't be able to
              change your answers after submission.
            </p>
            <div className="flex w-full max-w-sm flex-col gap-4 sm:flex-row">
              <button
                className="flex-1 rounded-xl bg-green-500 py-4 font-bold text-white transition-all hover:bg-green-600 hover:shadow-lg hover:shadow-green-100"
                onClick={handleConfirmSubmission}
              >
                Yes, Submit Now
              </button>
              <button
                onClick={() => setSubmitConfirmation(false)}
                className="flex-1 rounded-xl bg-gray-100 py-4 font-bold text-gray-600 transition-all hover:bg-gray-200"
              >
                No, Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </Watermark>
  );
};

export default TestingScreen;
