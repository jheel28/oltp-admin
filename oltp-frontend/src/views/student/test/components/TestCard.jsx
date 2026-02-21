import { useNavigate } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";

const TestCard = ({ test, isActive }) => {
  const navigate = useNavigate();

  const handleStartExam = async () => {
    if (!isActive) return;

    const elem = document.documentElement;

    try {
      if (!document.fullscreenElement) {
        await elem.requestFullscreen();
      }
    } catch (err) {
      message.error({
        content: "Fullscreen permission denied. Please allow fullscreen for the exam.",
        duration: 3,
        key: "fullscreen-error"
      });
    }

    navigate(`/student/test/${test._id}`);
  };

  return (
    <Card extra={"flex flex-col w-full h-full p-4 bg-white dark:bg-navy-700 border border-gray-100 dark:border-navy-600 rounded-2xl shadow-sm"}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white leading-tight">
            {test.testName}
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1 italic">
            {test.course}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Schedule</span>
          <span className="text-sm font-bold text-navy-700 dark:text-white mt-1">
            {test.date}
          </span>
          <span className="text-[11px] text-gray-500">
            {test.startTime} - {test.endTime}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-navy-700 dark:text-white">
            {test.course}
          </span>
          <span className="mt-1 text-sm font-medium text-gray-600">
            {test.testName}
          </span>
        </div>
      </div>

      {isActive ? (
        <button
          onClick={handleStartExam}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-200 dark:shadow-none"
        >
          Start Exam
        </button>
      ) : (
        <div className="w-full bg-gray-100 text-gray-400 font-bold py-3 rounded-xl text-center cursor-not-allowed border border-gray-200">
          Exam Inactive
        </div>
      )}
    </Card>
  );
};

export default TestCard;