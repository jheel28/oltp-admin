import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profile from "assets/img/profile/image1.png";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { message, Watermark } from "antd";
import { AuthContext } from "components/Auth-context";

const TestingScreen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitConfirmation, setSubmitConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [visitedQuestions, setVisitedQuestions] = useState(
    Array(6).fill(false)
  );
  const [questions, setQuestions] = useState([]);
  const [optionIndex, setOptionIndex] = useState(
    Array(questions.length).fill(null)
  );
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [test, setTest] = useState({});
  const [student, setStudent] = useState({});
  const [remainingTime, setRemainingTime] = useState(30 * 60);

  // Use refs to avoid timer resets when options change
  const stateRef = React.useRef({ questions: [], optionIndex: [], student: {}, test: {} });

  useEffect(() => {
    stateRef.current = { questions, optionIndex, student, test };
  }, [questions, optionIndex, student, test]);
  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/test/bytestid/${id}`
        );
        if (!testResponse.ok) {
          throw new Error(`HTTP error! Status: ${testResponse.status}`);
        }
        const testData = await testResponse.json();
        setTest(testData.test);

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
        setTest(testData.test);

        // Update remaining time based on test duration
        if (testData.test.duration) {
          setRemainingTime(testData.test.duration * 60);
        }

        setQuestions(questionsData.questions);
        setOptionIndex(Array(questionsData.questions.length).fill(null));
        setSelectedOptions(Array(questionsData.questions.length).fill(null));
      } catch (err) {
        message.error("Error while fetching data");
      }
    };

    fetchTestAndQuestions();
  }, []);

  const submitFinalTest = React.useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { questions: curQuestions, optionIndex: curOptionIndex, student: curStudent, test: curTest } = stateRef.current;

    console.log("Starting submission for student:", curStudent.studentId);

    const calculateLocalScore = () => {
      let score = 0;
      curQuestions.forEach((question, index) => {
        if (curOptionIndex[index] === question.correctOption) {
          score += question.marks;
        }
      });
      return score;
    };

    const score = calculateLocalScore();
    const maxscore = curTest.score;

    if (curStudent.studentId && curTest.testId && curTest.questionPaperId) {
      try {
        const data = {
          marks: score,
          studentId: curStudent.studentId,
          testId: curTest.testId,
          questionPaperId: curTest.questionPaperId,
          maxscore: maxscore,
          questions: curQuestions.map((question, index) => ({
            questionId: question._id,
            correctAnswer: question.correctOption,
            chosenAnswer: curOptionIndex[index],
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Something went wrong while submitting the test");
        }
        message.success("Successfully submitted the test");
        navigate(`/student/feedbackscreen/${score}/${maxscore}`);
      } catch (err) {
        console.error("Submission Error Details:", err);
        message.error(`Submission failed: ${err.message}`);
        setIsSubmitting(false);
      }
    } else {
      console.error("Missing required fields for submission:", {
        studentId: curStudent.studentId,
        testId: curTest.testId,
        qpId: curTest.questionPaperId
      });
      message.error("Could not submit: Test data missing");
      setIsSubmitting(false);
    }
  }, [auth.token, navigate, isSubmitting]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 5 * 60) {
          message.warning("Only 5 minutes left!");
        }
        if (prevTime <= 1) {
          clearInterval(timer);
          if (prevTime === 1) {
            message.warning("Time's up! Test will be submitted automatically.");
            submitFinalTest();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitFinalTest]);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (optionIndex[index] === question.correctOption) {
        score += question.marks;
      }
    });
    return score;
  };

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
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionId;
    setSelectedOptions(updatedSelectedOptions);

    const updatedOptionIndex = [...optionIndex];
    updatedOptionIndex[questionIndex] = index;

    setOptionIndex(updatedOptionIndex);

    const updatedVisitedQuestions = [...visitedQuestions];
    updatedVisitedQuestions[questionIndex] = true;
    setVisitedQuestions(updatedVisitedQuestions);
  };

  const handleTestSubmission = () => {
    setSubmitConfirmation(true);
  };

  const handleClearOptions = () => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestion] = null;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleConfirmSubmission = async () => {
    await submitFinalTest();
  };

  return (
    <div className="text-black relative flex min-h-screen flex-col items-center bg-gray-100">
      <div className="mb-6 mt-0 w-full bg-blue-500 py-4 text-center text-2xl font-bold text-white">
        <h1>Correct Steps Online Testing Platform </h1>
      </div>

      {!submitConfirmation ? (
        <div className="flex w-full flex-col px-4 lg:flex-row">
          <div className="mb-8 flex-1 lg:mb-0 lg:pr-8">
            {/* Left side area for questions and options */}
            {questions.length > 0 && (
              <div className="mb-4">
                <Watermark
                  content={`Testid:${test.testId}`}
                  gap={[30, 30]}
                  offset={[0, 0]}
                >
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h3 className="mb-8 text-lg font-bold">
                      Question {currentQuestion + 1}:{" "}
                      {questions[currentQuestion].text}
                    </h3>

                    {questions[currentQuestion].questionImage && (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/${questions[currentQuestion].questionImage}`}
                        alt="Question Image"
                        className="mr-4 rounded-lg" // You can remove the height and width classes
                        style={{
                          height: "500px",
                        }}
                      // Adjust these classes as needed
                      />
                    )}
                    <br />
                    <br />

                    <div className="flex flex-col">
                      {questions[currentQuestion].options.map(
                        (option, index) => (
                          <label
                            key={option._id}
                            className={`mb-2 inline-flex cursor-pointer items-center rounded-lg p-2 ${selectedOptions[currentQuestion] === option._id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                              }`}
                            onClick={() =>
                              handleOptionSelect(
                                option._id,
                                currentQuestion,
                                index
                              )
                            }
                          >
                            <input
                              type="radio"
                              className="form-radio sr-only"
                              name="option"
                            />
                            <span className="ml-2">{option.text}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </Watermark>
              </div>
            )}
            <div className="fixed bottom-0 left-0 flex w-full justify-between bg-gray-100 px-4 py-2 lg:w-4/5">
              <button
                onClick={handlePreviousQuestion}
                className="flex items-center rounded-full bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                <AiOutlineArrowLeft className="mr-2" />
                Previous
              </button>
              <button
                onClick={handleClearOptions}
                className="rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
              >
                Clear
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex items-center rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Next <AiOutlineArrowRight className="ml-2" />
              </button>
            </div>
          </div>
          {/** Right side area for student info, timer, and question tiles */}
          <div className="order-first flex-none lg:order-last lg:w-1/3 lg:pl-2">
            <div className="mb-4 flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`} // Replace with the actual path to your image
                alt="Image Description"
                className="ml-4 rounded-full" // Use rounded-full class to make the image round
                style={{ width: "80px", height: "80px" }} // Adjust width and height as needed
              />
              <p className="text-sm font-medium">
                {student.firstName + " " + student.lastName}
              </p>
              {/* <p className="text-xs text-gray-500">JK Lakshmipat University</p> */}
              <p>Test Name: {test.examName}</p>
              <p>Test ID: {test.testId}</p>
              {/* Timer implementation */}
              <p>
                Timer:{" "}
                {Math.floor(remainingTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(remainingTime % 60).toString().padStart(2, "0")}
              </p>
            </div>
            <div className="mb-8 overflow-x-hidden overflow-y-hidden rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-lg font-bold">Questions</h3>
              <div className="mb-4">
                <div className="max-h-36 overflow-y-auto">
                  <div className="grid grid-cols-6 gap-2">
                    {questions.map((question, index) => (
                      <div
                        key={question._id}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 ${visitedQuestions[question._id - 1]
                          ? selectedOptions[question._id - 1] !== null
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : currentQuestion === question._id - 1
                            ? "bg-blue-500 text-white"
                            : ""
                          }`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleTestSubmission}
                  className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>Are you sure you want to submit the test?</p>
          <div className="mt-4 flex">
            <button
              className="mr-2 rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700"
              onClick={handleConfirmSubmission}
            >
              Yes
            </button>
            <button
              onClick={() => setSubmitConfirmation(false)}
              className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestingScreen;
 