import React, { useContext, useEffect, useState } from "react";

import Ranking from "views/student/default/components/Ranking";
import Upcoming from "views/student/default/components/Upcoming";
import PapersSolved from "views/student/default/components/PapersSolved";
import MiniCalendar from "components/calendar/MiniCalendar";
import StudentPerformance from "views/student/default/components/StudentPerformance";
import Pie from "views/student/default/components/Pie";
import { AuthContext } from "components/Auth-context";
import TestCard from "views/student/test/components/TestCard";
import { IoMdAlarm } from "react-icons/io";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`
        );
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/student/byid/${auth.userId}`
        );

        if (!testResponse.ok || !studentResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${testResponse.status}, ${studentResponse.status}`
          );
        }

        const testData = await testResponse.json();
        const studentData = await studentResponse.json();

        setTests(testData.tests);
        setStudent(studentData.student);

        if (studentData.student && studentData.student.studentId) {
          const scoreResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/attempted/tests/bystudentId/${studentData.student.studentId}`
          );

          if (!scoreResponse.ok) {
            throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
          }

          const scoreData = await scoreResponse.json();
          setAttempted(scoreData.tests);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [auth.userId]);
  const filteredTests = tests.filter((test) => {
    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );
    const isSameBatch = student.batch === test.batchName;

    return !isTestAttempted && isSameBatch;
  });
  const attemptedTestsCount = tests.length - filteredTests.length;

  // Active Tests: Date is today AND current time is within [startTime, endTime]
  const currentTime = new Date();
  // Get local date string YYYY-MM-DD
  const year = currentTime.getFullYear();
  const month = String(currentTime.getMonth() + 1).padStart(2, "0");
  const day = String(currentTime.getDate()).padStart(2, "0");
  const localTodayStr = `${year}-${month}-${day}`;

  const activeTests = filteredTests.filter((test) => {
    if (test.date !== localTodayStr) return false;
    const start = new Date(`${test.date} ${test.startTime}`);
    const end = new Date(`${test.date} ${test.endTime}`);
    return currentTime >= start && currentTime <= end;
  });

  // Upcoming Tests: Scheduled for the future (either a later date OR later today)
  const upcomingTests = filteredTests.filter((test) => {
    const start = new Date(`${test.date} ${test.startTime}`);
    // A test is upcoming if it starts after now and is NOT already active
    return start > currentTime && !activeTests.some(at => at.testId === test.testId);
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Widgets Section */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Ranking />
        <PapersSolved attemptedTests={attemptedTestsCount} />
        <Upcoming unattemptedTests={upcomingTests} />
      </div>

      {/* Performance & Calendar Section */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-1">
          <StudentPerformance tests={tests} />
        </div>
        <div className="col-span-1">
          <div className="h-full rounded-[20px] bg-white dark:bg-navy-800 p-2">
            <MiniCalendar />
          </div>
        </div>
      </div>

      {/* Active Exams Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Active Exams
          </h4>
          {activeTests.length > 0 && (
            <span className="flex h-2 w-2 animate-ping rounded-full bg-red-500"></span>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {activeTests.length > 0 ? (
            activeTests.map((test) => (
              <div key={test.testId} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] transition-all duration-300 hover:translate-y-[-4px]">
                <TestCard test={test} />
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6 bg-white dark:bg-navy-800 rounded-2xl border border-dashed border-gray-200 dark:border-navy-700">
              <div className="rounded-full bg-gray-50 dark:bg-navy-900 p-3 mb-2">
                <IoMdAlarm className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">No Active Exams</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center px-4">Tests will appear here during their scheduled time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Exams Section */}
      <div className="flex flex-col mb-4">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3 px-1">
          Upcoming Exams
        </h4>
        <div className="flex flex-wrap gap-4">
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <div key={test.testId} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] transition-all duration-300 hover:translate-y-[-4px]">
                <TestCard test={test} />
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-6 bg-white dark:bg-navy-800 rounded-2xl border border-dashed border-gray-200 dark:border-navy-700">
              <div className="rounded-full bg-gray-50 dark:bg-navy-900 p-3 mb-2">
                <IoMdAlarm className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">No Upcoming Exams</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">New exams will be listed here when scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
