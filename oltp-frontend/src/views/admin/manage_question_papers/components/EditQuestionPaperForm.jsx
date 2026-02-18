import React, { useEffect, useState, useContext } from "react";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import { FaImage } from "react-icons/fa";

const EditQuestionPaper = ({ questionPaper, onCancel }) => {
  const auth = useContext(AuthContext);
  // State to manage question paper data
  const [editedQuestionPaper, setEditedQuestionPaper] = useState({});
  const [questions, setQuestions] = useState([]);
  const [showQuestionImageInput, setShowQuestionImageInput] = useState(false);
  const [showOptionImageInputs, setShowOptionImageInputs] = useState([]);

  // Update editedQuestionPaper state when questionPaper prop changes
  useEffect(() => {
    setEditedQuestionPaper(questionPaper);
    if (questionPaper && questionPaper.questionPaperId) {
      fetchQuestions(questionPaper.questionPaperId);
    }
  }, [questionPaper]);

  const fetchQuestions = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/byquestionpaperid/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      message.error("Error fetching questions for this paper");
    }
  };

  // Function to handle changes in question paper data
  const handleQuestionPaperChange = (field, value) => {
    setEditedQuestionPaper({ ...editedQuestionPaper, [field]: value });
  };

  const handleQuestionTextChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionTextChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const currentCorrect = newQuestions[questionIndex].correctOption;

    if (newQuestions[questionIndex].type === "MCQ") {
      if (Array.isArray(currentCorrect)) {
        if (currentCorrect.includes(optionIndex)) {
          newQuestions[questionIndex].correctOption = currentCorrect.filter(id => id !== optionIndex);
        } else {
          newQuestions[questionIndex].correctOption = [...currentCorrect, optionIndex];
        }
      } else {
        newQuestions[questionIndex].correctOption = [optionIndex];
      }
    } else {
      newQuestions[questionIndex].correctOption = optionIndex;
    }
    setQuestions(newQuestions);
  };

  const handleMarksChange = (questionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].marks = parseInt(event.target.value);
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].options) newQuestions[questionIndex].options = [];
    newQuestions[questionIndex].options.push({ text: "", image: null });
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        questionImage: null,
        options: [{ text: "" }],
        correctOption: [],
        marks: 1,
        difficulty: "Medium",
        topic: "",
        type: "MCQ",
        questionPaperId: editedQuestionPaper.questionPaperId
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Function to submit edited question paper data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Update Paper Metadata
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/update/questionpaper/byid/${editedQuestionPaper._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(editedQuestionPaper),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update question paper metadata");
      }

      // 2. Update/Create Questions
      for (const question of questions) {
        const isNew = !question._id;
        const url = isNew
          ? `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/create/question`
          : `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/update/question/byid/${question._id}`;

        const method = isNew ? "POST" : "PATCH";

        // Use FormData if there's an image, but for now assuming JSON for simplicity of parity with existing logic unless explicitly needed
        // The backend updateQuestionById seems to expect JSON. createQuestion expects FormData.

        let res;
        if (isNew) {
          const formData = new FormData();
          Object.keys(question).forEach(key => {
            if (key === "options") {
              formData.append(key, JSON.stringify(question[key]));
            } else {
              formData.append(key, question[key]);
            }
          });
          res = await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          });
        } else {
          res = await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
            body: JSON.stringify(question),
          });
        }

        if (!res.ok) {
          console.error(`Failed to ${isNew ? 'create' : 'update'} question`, question);
        }
      }

      message.success("Question Paper and Questions successfully updated");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
      message.error(
        "Something went wrong while updating, please try again"
      );
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <strong>Question Paper ID:</strong>
        <input
          type="text"
          value={editedQuestionPaper.questionPaperId || ""}
          onChange={(e) =>
            handleQuestionPaperChange("questionPaperId", e.target.value)
          }
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
        />
      </div>
      <div className="mb-4">
        <strong>Category:</strong>
        <select
          value={editedQuestionPaper.category || ""}
          onChange={(e) =>
            handleQuestionPaperChange("category", e.target.value)
          }
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
        >
          <option value="">Select a category</option>
          <option value="NEET">NEET</option>
          <option value="Mains">Mains</option>
          <option value="Advance">Advance</option>
          <option value="Mechanics">Mechanics</option>
          <option value="Robotics">Robotics</option>
          <option value="CAD">CAD</option>
        </select>
      </div>
      <div className="mb-4">
        <strong>Subjects:</strong>
        <input
          type="text"
          placeholder="e.g., Physics, Chemistry"
          value={editedQuestionPaper.subjects || ""}
          onChange={(e) =>
            handleQuestionPaperChange("subjects", e.target.value)
          }
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
        />
      </div>

      <div className="mb-4">
        <strong>Maximum Marks:</strong>
        <input
          type="number"
          min="0"
          value={editedQuestionPaper.score || ""}
          onChange={(e) =>
            handleQuestionPaperChange("score", parseInt(e.target.value))
          }
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
        />
        <strong>Number of Questions:</strong>
        <input
          type="number"
          min="0"
          value={editedQuestionPaper.noOfQuestions || ""}
          onChange={(e) =>
            handleQuestionPaperChange("noOfQuestions", parseInt(e.target.value))
          }
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
        />
      </div>

      <hr className="my-6 border-gray-300" />
      <h3 className="text-lg font-bold mb-4">Questions</h3>

      {questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="mb-4 rounded-lg border border-gray-300 p-4"
        >
          <button
            className="float-right rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            onClick={() => handleDeleteQuestion(questionIndex)}
          >
            Delete Question
          </button>
          <div className="mb-2">
            <strong>Question {questionIndex + 1}:</strong>
            <input
              type="text"
              placeholder="Enter Question Text"
              className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
              value={question.text}
              onChange={(e) => handleQuestionTextChange(questionIndex, e)}
            />
            <input
              type="text"
              placeholder="Topic (e.g., Calculus, Organic Chemistry)"
              className="block w-full rounded-lg border-gray-300 p-2 mt-2 text-sm italic focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
              value={question.topic || ""}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[questionIndex].topic = e.target.value;
                setQuestions(newQs);
              }}
            />
            <div className="mt-2 text-xs text-gray-500">
              Type: {question.type || "MCQ"}
            </div>
            {question.questionImage && (
              <div className="mt-2">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${question.questionImage}`}
                  alt="Question"
                  className="max-h-32 rounded"
                />
              </div>
            )}
          </div>

          {question.type === "MCQ" || !question.type ? (
            <div>
              {question.options && question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="mb-2 rounded-lg border border-gray-200 p-2"
                >
                  <strong>Option {optionIndex + 1}:</strong>
                  <input
                    type="text"
                    placeholder={`Enter Option ${optionIndex + 1} Text`}
                    className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionTextChange(questionIndex, optionIndex, e)
                    }
                  />
                  <label className="ml-2 flex items-center mt-1">
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={Array.isArray(question.correctOption) && question.correctOption.includes(optionIndex)}
                      onChange={() =>
                        handleCorrectOptionChange(questionIndex, optionIndex)
                      }
                    />
                    Correct
                  </label>
                  <button
                    className="mt-1 rounded bg-red-500 px-2 py-1 text-white text-xs hover:bg-red-600"
                    onClick={() =>
                      handleDeleteOption(questionIndex, optionIndex)
                    }
                  >
                    Delete Option
                  </button>
                </div>
              ))}
              <button
                className="rounded bg-blue-500 px-3 py-1 text-white text-sm hover:bg-blue-600"
                onClick={() => handleAddOption(questionIndex)}
              >
                Add Option
              </button>
            </div>
          ) : (
            <div>
              <strong>Correct Answer (Numerical):</strong>
              <input
                type="number"
                step="any"
                placeholder="Enter Correct Numerical Value"
                className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
                value={question.correctOption || ""}
                onChange={(e) =>
                  handleCorrectOptionChange(questionIndex, parseFloat(e.target.value))
                }
              />
            </div>
          )}
          <div className="mt-2">
            <strong>Marks:</strong>
            <input
              type="number"
              min="0"
              className="block w-32 rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
              value={question.marks || 0}
              onChange={(e) => handleMarksChange(questionIndex, e)}
            />
          </div>
        </div>
      ))}

      <button
        className="mb-6 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        onClick={handleAddQuestion}
      >
        Add New Question
      </button>

      <div className="flex justify-between border-t pt-4">
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-500 px-6 py-2 text-white font-bold hover:bg-blue-600"
        >
          Update All
        </button>
        <button
          onClick={onCancel}
          className="rounded bg-red-500 px-6 py-2 text-white font-bold hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditQuestionPaper;
