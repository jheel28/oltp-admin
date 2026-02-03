import React, { useState } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const { score } = useParams();
  const { maxscore } = useParams();

  const handleSubmitFeedback = () => {
    // Submit feedback logic goes here
    message.success("Thank you for your feedback!");
    // Clear the feedback input after submission
    setFeedback("");
    navigate("/student/default/");
  };

  const handleDashboard = () => {
    message.success("Thank you for your feedback!");
    navigate("/student/default/");
  };

  return (
    <div className="text-black flex h-screen flex-col items-center bg-gray-100">
      <div className="mb-6 w-full bg-blue-500 py-4 text-center text-2xl font-bold text-white">
        <h1>
          Congratulations! You obtained {score}/{maxscore} marks in the test
        </h1>
      </div>
      <div className="w-full rounded-lg bg-white p-6 shadow-md md:w-96">
        <p className="mb-4 text-lg">
          You have completed the test successfully.
        </p>
        <p>Please provide your feedback:</p>
        <textarea
          className="mt-2 w-full rounded-md border border-gray-300 p-2"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <div className="mt-4 flex flex-col md:flex-row">
          <button
            className="mb-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 md:mb-0 md:mr-2"
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </button>
          <button
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            onClick={handleDashboard}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;
