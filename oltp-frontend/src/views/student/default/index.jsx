import React, { useContext, useEffect, useState } from "react";

import Ranking from "views/student/default/components/Ranking";
import Upcoming from "views/student/default/components/Upcoming";
import PapersSolved from "views/student/default/components/PapersSolved";
import BatchRank from "views/student/default/components/BatchRank";
import MiniCalendar from "components/calendar/MiniCalendar";
import StudentPerformance from "views/student/default/components/StudentPerformance";
import { AuthContext } from "components/Auth-context";
import TestCard from "views/student/test/components/TestCard";
import { IoMdAlarm } from "react-icons/io";
import Card from "components/card";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const auth = useContext(AuthContext);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testResponse, studentResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`),
        ]);

        if (!testResponse.ok || !studentResponse.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const testData = await testResponse.json();
        const studentData = await studentResponse.json();

        setTests(testData.tests || []);
        setStudent(studentData.student || null);

        if (studentData.student?.studentId) {
          const scoreResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/attempted/tests/bystudentid/${studentData.student.studentId}`
          );
          if (scoreResponse.ok) {
            const scoreData = await scoreResponse.json();
            setAttempted(scoreData.tests || []);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [auth.userId]);

  const parseTestDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date(0);
    const parts = dateStr.split(/[-/]/).map(Number);
    let year, month, day;
    if (parts[0] > 1000) [year, month, day] = parts;
    else if (parts[2] > 1000) [day, month, year] = parts;
    else [year, month, day] = parts;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0);
  };

  const batchTests = tests.filter(
    (test) => student && student.batch === test.batchName && test.isPublished !== false
  );

  const filteredTests = batchTests.filter((test) => {
    const isAttempted = attempted.some((a) => a.testId === test.testId);
    const endTime = parseTestDateTime(test.date, test.endTime);
    return !isAttempted && currentTime <= endTime;
  });

  const activeTests = filteredTests.filter((test) => {
    const startTime = parseTestDateTime(test.date, test.startTime);
    const endTime = parseTestDateTime(test.date, test.endTime);
    return currentTime >= startTime && currentTime <= endTime;
  });

  const upcomingTests = filteredTests.filter((test) => {
    const startTime = parseTestDateTime(test.date, test.startTime);
    return startTime > currentTime;
  });

  const attemptedCount = attempted.length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const EmptyState = ({ message, sub }) => (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-8 dark:border-navy-700 dark:bg-navy-800">
      <div className="mb-2 rounded-full bg-gray-50 p-3 dark:bg-navy-900">
        <IoMdAlarm className="h-6 w-6 text-gray-300" />
      </div>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{message}</p>
      {sub && (
        <p className="mt-1 px-4 text-center text-xs text-gray-400 dark:text-gray-500">{sub}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {student && (
        <Card extra="px-5 py-4 flex flex-row items-center gap-4">
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`}
            alt="profile"
            className="h-14 w-14 rounded-full object-cover shadow"
          />
          <div>
            <p className="text-base font-bold text-navy-700 dark:text-white">
              {getGreeting()}, {student.firstName}!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Batch: <span className="font-semibold text-brand-500">{student.batch}</span>
              {" · "}
              ID: <span className="font-semibold text-gray-600 dark:text-gray-300">{student.studentId}</span>
            </p>
          </div>
        </Card>
      )}

      <div className="mt-1 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Ranking tests={attempted} />
        <PapersSolved attemptedTests={attemptedCount} />
        <Upcoming unattemptedTests={upcomingTests} />
        {student && (
          <BatchRank studentId={student.studentId} batch={student.batch} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-1">
          <StudentPerformance tests={tests} attemptedScores={attempted} />
        </div>
        <div className="col-span-1">
          <div className="h-full min-h-[350px] rounded-[20px] bg-white p-2 dark:bg-navy-800">
            <MiniCalendar
              value={calendarValue}
              onChange={setCalendarValue}
              exams={batchTests}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between px-1">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Active Exams
          </h4>
          {activeTests.length > 0 && (
            <span className="flex h-2 w-2 animate-ping rounded-full bg-red-500" />
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {activeTests.length > 0 ? (
            activeTests.map((test) => (
              <div
                key={test.testId}
                className="w-full transition-all duration-300 hover:-translate-y-1 md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]"
              >
                <TestCard test={test} isActive={true} />
              </div>
            ))
          ) : (
            <EmptyState
              message="No Active Exams"
              sub="Tests will appear here during their scheduled time."
            />
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col">
        <h4 className="mb-3 px-1 text-xl font-bold text-navy-700 dark:text-white">
          Upcoming Exams
          {student && (
            <span className="ml-2 text-sm font-normal text-gray-400 dark:text-gray-500">
              · {student.batch}
            </span>
          )}
        </h4>
        <div className="flex flex-wrap gap-4">
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <div
                key={test.testId}
                className="w-full transition-all duration-300 hover:-translate-y-1 md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]"
              >
                <TestCard test={test} isActive={false} />
              </div>
            ))
          ) : (
            <EmptyState
              message="No Upcoming Exams"
              sub="New exams assigned to your batch will appear here."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;