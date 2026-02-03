import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useState } from "react";
import Card from "components/card";
import { Button, message, notification } from "antd";
import ReactDOM from 'react-dom';
import TestingPlatformHome from "views/student/test/TestingPlatform/testingPlatformHome";
import { useNavigate } from "react-router-dom";
const TestCard = ({
  title,
  author,
  price,
  image,
  bidders,
  extra,
  score,
  course,
  examName,
  batchName,
}) => {
  const [heart, setHeart] = useState(true);
  const navigate=useNavigate();
  const handleClick = () => {
    // Prompt the user to activate full-screen mode manually
    message.success("To get the best experience, please activate full-screen mode.");

    // Request full screen for the document
    document.documentElement.requestFullscreen()
        .then(() => {
            // Navigate to the desired route after full-screen mode is activated
            navigate("/student/test");
        })
        .catch(error => {
            console.error('Error entering full screen:', error);
        });
};








  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
          <img
            src={image}
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            alt=""
          />
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Score: {score}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Course: {course}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Batch Name: {batchName}
            </p>
          </div>
            <Button primary size="large" onClick={handleClick}>
              Start
            </Button>
        </div>
      </div>
    </Card>
  );
};

export default TestCard;
