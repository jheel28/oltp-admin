import React, { useEffect, useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineFullscreen } from "react-icons/ai";
import Card from "components/card";
import { message } from "antd";
import profile from "assets/img/profile/image1.png";
import { useNavigate, useParams } from "react-router-dom";

const TestingPlatformHome = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleStartTest = () => {
    if (accepted) {
      // Start the test logic here
      console.log("Test started!");
      // Redirect to the test page
      navigate(`/student/testingscreen/${id}`);
    } else {
      message.warning("Please accept the guidelines to start the test.");
    }
  };

  return (
    <div className="text-black flex h-screen flex-col items-center justify-between bg-gray-100">
      <div className="mt-8">
        <div className="mb-8 flex flex-col items-center">
          <h1 className="mb-2 text-7xl font-bold">Beta Classes</h1>
          <h2 className="mb-2 text-3xl font-bold">Online Test Name</h2>
          <p className="text-md">Test ID: {id}</p>
        </div>
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Test Guidelines</h2>
          <p className="mb-4 text-sm">
            Please read and accept the following guidelines before starting the
            test:
          </p>
          <ol className="ml-8 list-decimal">
            <li>Do not refresh the page during the test.</li>
            <li>Do not use any external resources.</li>
            <li>Do not communicate with anyone during the test.</li>
            <li>Answer all questions within the given time.</li>
            <li>Once started, the test cannot be paused.</li>
            <li>
              Follow the specific instructions provided for each section of the
              test.
            </li>
            <li>
              Make sure your internet connection is stable before starting the
              test.
            </li>
            <li>
              Ensure your device's battery is sufficiently charged or plugged
              in.
            </li>
            <li>
              Familiarize yourself with the test interface before starting the
              exam.
            </li>
          </ol>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="acceptGuidelines"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="mr-2"
            />
            <label htmlFor="acceptGuidelines">I accept the guidelines</label>
            {accepted && (
              <IoMdCheckmarkCircleOutline className="ml-2 text-green-500" />
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full justify-between px-4">
        <div className="flex items-center">
          {/* <img
            src={profile}
            alt="User Image"
            className="mr-2 h-12 w-12 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">Bhanu Prakash</p>
            <p className="text-xs text-gray-500">JK Lakshmipat University</p>
          </div> */}
        </div>
        <button
          onClick={handleStartTest}
          className={`rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 ${
            !accepted && "cursor-not-allowed opacity-50"
          }`}
          disabled={!accepted}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default TestingPlatformHome;
