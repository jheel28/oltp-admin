import { Select, message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";

const QuizForm = ({ onSubmit, onCancel }) => {
  const auth = useContext(AuthContext);
  const [testInfo, setTestInfo] = useState({
    examName: "",
    batchName: "",
    score: "",
    date: "",
    startTime: "",
    endTime: "",
    testId: "",
    course: "",
    questionPaperId: "",
  });
  const [questionPapers, setQuestionPapers] = useState([]);
  const [batches, setBatches] = useState([]);

  const handleTestInfoChange = (field, value) => {
    setTestInfo({ ...testInfo, [field]: value });
  };
  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/all/questionpapers`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuestionPapers(data.questionPapers);
      } catch (err) {}
    };
    fetchQuestionPapers();
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBatches(data.batches);
      } catch (err) {}
    };
    fetchBatches();
  }, [batches, questionPapers]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/create/test/superadmin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(testInfo),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error, Status: ${response.status} `);
      }
      const responseData = await response.json();
      message.success("Test successfully created");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
      message.error("Something went wrong while creating the test");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <strong>Test Name:</strong>
        <input
          type="text"
          placeholder="Enter Test Name"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={testInfo.examName}
          onChange={(e) => handleTestInfoChange("examName", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <strong>Batch:</strong>

        <br />
        <Select
          style={{ width: "100%" }}
          value={testInfo.batchName}
          onChange={(value) => handleTestInfoChange("batchName", value)}
        >
          {batches.map((batch) => (
            <Select.Option value={batch.batchName}>
              {batch.batchName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <strong>Course:</strong>
        <input
          type="text"
          placeholder="Enter Test Stream"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={testInfo.course}
          onChange={(e) => handleTestInfoChange("course", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <strong>Test Id:</strong>
        <input
          type="text"
          placeholder="Enter Test Stream"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={testInfo.testId}
          onChange={(e) => handleTestInfoChange("testId", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <strong>Maximum Marks to Score:</strong>
        <input
          type="number"
          min="0"
          placeholder="Enter Maximum Marks"
          className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
          value={testInfo.score}
          onChange={(e) =>
            handleTestInfoChange("score", parseInt(e.target.value))
          }
        />
        <div className="mb-4">
          <strong>Date:</strong>
          <input
            type="date"
            className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
            value={testInfo.date}
            onChange={(e) => handleTestInfoChange("date", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <strong>Start Time:</strong>
          <input
            type="time"
            className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
            value={testInfo.startTime}
            onChange={(e) => handleTestInfoChange("startTime", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <strong>End Time:</strong>
          <input
            type="time"
            className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
            value={testInfo.endTime}
            onChange={(e) => handleTestInfoChange("endTime", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <strong>Question Paper:</strong>
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
            value={testInfo.questionPaperId}
            onChange={(value) => handleTestInfoChange("questionPaperId", value)}
          >
            {questionPapers.map((questionPaper) => (
              <Select.Option value={questionPaper.questionPaperId}>
                {questionPaper.questionPaperId}
              </Select.Option>
            ))}
          </Select>
          <br />
          <br />
        </div>
      </div>

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
    </div>
  );
};

export default QuizForm;
