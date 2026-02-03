import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaImage } from "react-icons/fa";

const QuestionPaperForm = ({ onCancel }) => {
  const auth = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [questionPaper, setQuestionPaper] = useState({
    questionPaperId: "",
    score: "",
    noOfQuestions: "",
    category: "",
  });
  const [questions, setQuestions] = useState([
    {
      text: "",
      questionImage: null,
      options: [{ text: "" }],
      correctOption: 0,
      marks: 1,
    },
  ]);
  const [showQuestionImageInput, setShowQuestionImageInput] = useState(false);
  const [showOptionImageInputs, setShowOptionImageInputs] = useState([]);

  const handleTestInfoChange = (field, value) => {
    setQuestionPaper({ ...questionPaper, [field]: value });
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        questionImage: null,
        options: [{ text: "" }],
        correctOption: 0,
        marks: 1,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleQuestionImageChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].questionImage = event.target.files[0];
    setQuestions(newQuestions);
  };

  const handleOptionTextChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionImageChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].image =
      event.target.files[0];
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(newQuestions);
  };

  const handleMarksChange = (questionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].marks = parseInt(event.target.value);
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", image: null });
    setShowOptionImageInputs([...showOptionImageInputs, false]); // Add a new entry for the new option
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    const newShowOptionImageInputs = [...showOptionImageInputs];
    newShowOptionImageInputs.splice(
      questionIndex * questions[questionIndex].options.length + optionIndex,
      1
    ); // Remove entry for deleted option
    setShowOptionImageInputs(newShowOptionImageInputs);
    setQuestions(newQuestions);
  };

  const handleToggleQuestionImageInput = () => {
    setShowQuestionImageInput(!showQuestionImageInput);
  };

  const handleToggleOptionImageInput = (questionIndex, optionIndex) => {
    const newShowOptionImageInputs = [...showOptionImageInputs];
    newShowOptionImageInputs[
      questionIndex * questions[questionIndex].options.length + optionIndex
    ] =
      !newShowOptionImageInputs[
        questionIndex * questions[questionIndex].options.length + optionIndex
      ];
    setShowOptionImageInputs(newShowOptionImageInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(questionPaper);
    try {
      const formData = new FormData();
      formData.append("keySheet", file);
      Object.keys(questionPaper).forEach((key) => {
        formData.append(key, questionPaper[key]);
      });
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/create/questionpaper/superadmin`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Network was not ok");
      }
      const responseData = await response.json();
      message.success("Question Paper successfully created");
    } catch (err) {
      console.log(err);
      message.error(
        "Something went wrong while creating the question paper, please try again"
      );
    }
    for (const question of questions) {
      try {
        question.questionPaperId = questionPaper.questionPaperId;
        const formData = new FormData();
        Object.keys(question).forEach((key) => {
          if (key === "options") {
            formData.append(key, JSON.stringify(question[key]));
          } else {
            formData.append(key, question[key]);
          }
        });
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/create/question/superadmin`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network was not ok");
        }
        console.log(question);
        const responseData = await response.json();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        message.success("QuestionPaper Successfully created");
      } catch (err) {
        console.error(err);
        message.error(
          "Something went wrong while creating the question paper, please try again"
        );
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <strong>Question Paper Id:</strong>
        <input
          type="text"
          placeholder="Enter Question Paper Id"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={questionPaper.questionPaperId}
          onChange={(e) =>
            handleTestInfoChange("questionPaperId", e.target.value)
          }
        />
      </div>
      <div className="mb-4">
        <strong>Category:</strong>
        <select
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={questionPaper.category}
          onChange={(e) => handleTestInfoChange("category", e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="NEET">NEET</option>
          <option value="Mains">Mains</option>
          <option value="Advance">Advance</option>
        </select>
      </div>

      <div className="mb-4">
        <strong>Maximum Marks to Score:</strong>
        <input
          type="number"
          min="0"
          placeholder="Enter Maximum Marks"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={questionPaper.score}
          onChange={(e) =>
            handleTestInfoChange("score", parseInt(e.target.value))
          }
        />
        <strong>Number of Questions:</strong>
        <input
          type="number"
          min="0"
          placeholder="Enter Numer of Questions"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={questionPaper.noOfQuestions}
          onChange={(e) =>
            handleTestInfoChange("noOfQuestions", parseInt(e.target.value))
          }
        />
        <strong>Upload answer sheet:</strong>
        <br />
        <br />
        <input
          type="file"
          accept=".docx, image/*, .pdf"
          onChange={(e) => handleFileChange(e)}
        />
      </div>
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
            <div className="mt-2 flex items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleQuestionImageChange(questionIndex, e)}
                style={{ display: showQuestionImageInput ? "block" : "none" }}
              />
              <FaImage
                className="ml-auto cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={handleToggleQuestionImageInput}
              />
            </div>
          </div>
          {/* Options */}
          <div>
            {question.options.map((option, optionIndex) => (
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
                <div className="mt-2 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleOptionImageChange(questionIndex, optionIndex, e)
                    }
                    style={{
                      display: showOptionImageInputs[
                        questionIndex * question.options.length + optionIndex
                      ]
                        ? "block"
                        : "none",
                    }}
                  />
                  <FaImage
                    className="ml-auto cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() =>
                      handleToggleOptionImageInput(questionIndex, optionIndex)
                    }
                  />
                </div>
                <label className="ml-2">
                  <input
                    type="radio"
                    checked={question.correctOption === optionIndex}
                    onChange={() =>
                      handleCorrectOptionChange(questionIndex, optionIndex)
                    }
                  />
                  Correct
                </label>
                <button
                  className="ml-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                  onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => handleAddOption(questionIndex)}
            >
              Add Option
            </button>
          </div>
          {/* Marks */}
          <div>
            <strong>Marks:</strong>
            <input
              type="number"
              min="0"
              placeholder="Enter Marks"
              className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
              value={question.marks}
              onChange={(e) => handleMarksChange(questionIndex, e)}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handleAddQuestion}
      >
        Add Question
      </button>
    </div>
  );
};

export default QuestionPaperForm;
