import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import MiniCalendar from "components/calendar/MiniCalendar";
import StudentPerformance from "views/student/default/components/StudentPerformance";
import TestCard from "views/student/test/components/TestCard";
import { MdBarChart, MdCheckCircle, MdBook, MdSchedule } from "react-icons/md";
import { IoMdAlarm } from "react-icons/io";
import { IoSchool, IoFlash } from "react-icons/io5";

const StatCard = ({ icon, title, value, accent = "blue" }) => {
  const map = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-500",
    slate: "bg-slate-600",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${map[accent]} text-white`}>
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ message, sub, icon: Icon = IoMdAlarm }) => (
  <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-10 dark:border-navy-700 dark:bg-navy-800">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
      <Icon className="h-6 w-6 text-blue-300" />
    </div>
    <p className="text-sm font-semibold text-gray-500">{message}</p>
    {sub && <p className="mt-1 max-w-[200px] px-4 text-center text-xs text-gray-400">{sub}</p>}
  </div>
);

const AttemptedRow = ({ score }) => {
  const pct = score.totalMarks > 0 ? Math.round((score.marksObtained / score.totalMarks) * 100) : 0;
  const date = score.createdAt ? new Date(score.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }) : "";
  
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0 dark:border-navy-700">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${score.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
        {score.passed ? <MdCheckCircle className="h-4 w-4" /> : <MdBook className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
          {score.testName || score.testId}
        </p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${pct >= 35 ? "bg-blue-600" : "bg-red-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700 dark:text-white">{pct}%</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000); // 30s refresh for time checks
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!auth.userId) return;
    const fetchData = async () => {
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      try {
        const [testRes, studRes] = await Promise.all([
          fetch(`${baseUrl}/api/v1/test/get/all/tests`),
          fetch(`${baseUrl}/api/v1/student/get/student/byid/${auth.userId}`),
        ]);
        const [testData, studData] = await Promise.all([testRes.json(), studRes.json()]);
        
        setTests(testData.tests || []);
        setStudent(studData.student || null);

        if (studData.student?.studentId) {
          const scoreRes = await fetch(`${baseUrl}/api/v1/score/get/attempted/tests/bystudentid/${studData.student.studentId}`);
          if (scoreRes.ok) {
            const scoreData = await scoreRes.json();
            setAttempted(scoreData.tests || []);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, [auth.userId]);

  const parseTestDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date(0);
    const parts = dateStr.includes("-") ? dateStr.split("-").map(Number) : dateStr.split("/").map(Number);
    let year, month, day;
    if (parts[0] > 1000) [year, month, day] = parts;
    else if (parts[2] > 1000) [day, month, year] = parts;
    else [year, month, day] = parts;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const batchTests = tests.filter(t => 
    student && 
    student.batch?.trim().toLowerCase() === t.batchName?.trim().toLowerCase() && 
    t.isPublished !== false
  );
  
  const filteredTests = batchTests.filter(test => {
    const isAttempted = attempted.some(a => a.testId === test.testId);
    if (test.isPermanent) return !isAttempted;
    const end = parseTestDateTime(test.date, test.endTime);
    return !isAttempted && currentTime <= end;
  });

  const activeTests = filteredTests.filter(test => {
    if (test.isPermanent) return true;
    const start = parseTestDateTime(test.date, test.startTime);
    const end = parseTestDateTime(test.date, test.endTime);
    return currentTime >= start && currentTime <= end;
  });

  const upcomingTests = filteredTests.filter(test => {
    if (test.isPermanent) return false;
    return parseTestDateTime(test.date, test.startTime) > currentTime;
  });

  const avgScore = attempted.length > 0 
    ? Math.round(attempted.reduce((acc, t) => acc + (t.totalMarks > 0 ? (t.marksObtained / t.totalMarks) * 100 : 0), 0) / attempted.length) 
    : 0;
  
  const passedCount = attempted.filter(t => t.passed).length;

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<MdBarChart />} title="Avg. Score" value={`${avgScore}%`} accent="blue" />
        <StatCard icon={<IoSchool />} title="Papers Solved" value={attempted.length} accent="slate" />
        <StatCard icon={<IoMdAlarm />} title="Upcoming Tests" value={upcomingTests.length} accent="orange" />
        <StatCard icon={<MdCheckCircle />} title="Passed Exams" value={passedCount} accent="green" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudentPerformance tests={tests} attemptedScores={attempted} />
        </div>
        <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
          <MiniCalendar value={calendarValue} onChange={setCalendarValue} exams={batchTests} />
        </div>
      </div>

      {/* Active Exams Banner */}
      {activeTests.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-3 flex items-center gap-2 px-1">
            <IoFlash className="h-5 w-5 text-red-500" />
            <h4 className="text-base font-bold text-gray-800 dark:text-white">Active Exams</h4>
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTests.map(test => (
              <TestCard key={test.testId} test={test} isActive={true} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col">
          <h4 className="mb-3 px-1 text-base font-bold text-gray-800 dark:text-white">Upcoming Exams</h4>
          <div className="flex flex-col gap-3">
            {upcomingTests.length > 0 ? (
              upcomingTests.slice(0, 3).map(test => <TestCard key={test.testId} test={test} isActive={false} />)
            ) : (
              <EmptyState message="No Upcoming Exams" sub="Exams assigned to your batch will appear here." icon={MdSchedule} />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h4 className="mb-3 px-1 text-base font-bold text-gray-800 dark:text-white">Recent Results</h4>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
            {attempted.length > 0 ? (
              [...attempted].reverse().slice(0, 5).map((score, i) => <AttemptedRow key={i} score={score} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <MdBook className="mb-2 h-8 w-8 text-gray-200" />
                <p className="text-sm text-gray-400">No tests attempted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;