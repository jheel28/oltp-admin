import React, { useEffect, useState } from "react";
import { message } from "antd";

const EditQuestionPaper = ({ questionPaper, onCancel }) => {
  // State to manage question paper data
  const [editedQuestionPaper, setEditedQuestionPaper] = useState({});

  // Update editedQuestionPaper state when questionPaper prop changes
  useEffect(() => {
    setEditedQuestionPaper(questionPaper);
  }, [questionPaper]);

  // Function to handle changes in question paper data
  const handleQuestionPaperChange = (field, value) => {
    setEditedQuestionPaper({ ...editedQuestionPaper, [field]: value });
  };

  // Function to submit edited question paper data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/update/questionpaper/${editedQuestionPaper._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // need to add authorization when it is ready
          },
          body: JSON.stringify(editedQuestionPaper),
        }
      );
      if (!response.ok) {
        throw new Error("Network was not ok");
      }
      const responseData = await response.json();
      message.success("Question Paper successfully updated");
    } catch (err) {
      console.log(err);
      message.error(
        "Something went wrong while updating the question paper, please try again"
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
        </select>
      </div>

      <div className="mb-4">
        <strong>Maximum Marks to Score:</strong>
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

      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={onCancel}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditQuestionPaper;
