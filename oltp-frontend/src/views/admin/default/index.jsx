import { useEffect, useState } from "react";
import PieChartCard from "views/admin/default/components/PieChartCard";
import MiniCalendar from "components/calendar/MiniCalendar";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdGroups, MdCheckCircle, MdAccessTime } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const StatCard = ({ icon, title, value, accent = "blue" }) => {
  const accentMap = {
    blue: "bg-blue-600 text-white",
    slate: "bg-slate-600 text-white",
    green: "bg-green-600 text-white",
    orange: "bg-orange-500 text-white",
  };
  
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentMap[accent]}`}>
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const RecentScoreRow = ({ score }) => {
  const pct = score.totalMarks > 0 ? Math.round((score.marksObtained / score.totalMarks) * 100) : 0;
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0 dark:border-navy-700">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${score.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
        {score.passed ? <MdCheckCircle className="h-5 w-5" /> : <MdAccessTime className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
          {score.studentName || "Unknown Student"}
        </p>
        <p className="truncate text-xs text-gray-400">{score.testName || "General Test"}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${score.passed ? "text-green-600" : "text-red-500"}`}>{pct}%</p>
        <p className="text-[10px] text-gray-400">{score.marksObtained}/{score.totalMarks}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState({
    students: [],
    tests: [],
    batches: [],
    recentScores: []
  });
  const [calendarValue, setCalendarValue] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const endpoints = [
        `${baseUrl}/api/v1/student/get/all/students`,
        `${baseUrl}/api/v1/test/get/all/tests`,
        `${baseUrl}/api/v1/batch/get/all/batches`,
        `${baseUrl}/api/v1/score/get/all/scores`,
      ];

      try {
        const responses = await Promise.all(endpoints.map(url => fetch(url)));
        const [studData, testData, batchData, scoreData] = await Promise.all(
          responses.map(res => res.json())
        );

        setData({
          students: studData.students || [],
          tests: testData.tests || [],
          batches: batchData.batches || [],
          recentScores: (scoreData.scores || []).slice(0, 10),
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const publishedTestsCount = data.tests.filter((t) => t.isPublished).length;

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FaUsers />} title="Total Students" value={data.students.length} accent="blue" />
        <StatCard icon={<MdGroups />} title="Total Batches" value={data.batches.length} accent="blue" />
        <StatCard icon={<IoDocuments />} title="Total Tests" value={data.tests.length} accent="slate" />
        <StatCard icon={<MdCheckCircle />} title="Published Tests" value={publishedTestsCount} accent="green" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left/Middle Column: Charts & Calendar */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <PieChartCard />
            <div className="h-full min-h-[350px]">
                <MiniCalendar value={calendarValue} onChange={setCalendarValue} exams={data.tests} />
            </div>
          </div>
        </div>

        {/* Right Column: Recent Submissions */}
        <div className="h-full">
          <div className="h-full rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-50 pb-4 dark:border-navy-700">
              <MdBarChart className="h-5 w-5 text-blue-500" />
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">Recent Submissions</h4>
            </div>
            <div className="flex flex-col">
              {data.recentScores.length > 0 ? (
                data.recentScores.map((s) => <RecentScoreRow key={s._id} score={s} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MdAccessTime className="mb-2 h-10 w-10 text-gray-200" />
                  <p className="text-sm text-gray-400">No submissions recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;