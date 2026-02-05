import { useNavigate } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  const handleStartExam = () => {
    // Request full screen for the professional exam experience
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        message.error("Error attempting to enable full-screen: " + err.message);
      });
    }

    // Navigate to the test
    navigate(`/student/test/${test.testId}/${test._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card extra={"flex flex-col w-full h-full p-4 bg-white dark:bg-navy-700 border border-gray-100 dark:border-navy-600 rounded-2xl shadow-sm"}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white leading-tight">
            {test.examName}
          </h3>
          <p className="text-sm font-medium text-gray-500 mt-1 italic">
            {test.course}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(test.difficulty)}`}>
          {test.difficulty || "Medium"}
        </span>
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
            {test.course} {test.subjects ? `| ${test.subjects}` : ""}
          </span>
          <span className="mt-1 text-sm font-medium text-gray-600">
            {test.examName}
          </span>
        </div>
      </div>

      <button
        onClick={handleStartExam}
        className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-200 dark:shadow-none"
      >
        Start Exam
      </button>
    </Card>
  );
};

export default TestCard;
