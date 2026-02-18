import React, { useContext, useEffect, useState } from "react";

import Ranking from "views/student/default/components/Ranking";
import Upcoming from "views/student/default/components/Upcoming";
import PapersSolved from "views/student/default/components/PapersSolved";
import MiniCalendar from "components/calendar/MiniCalendar";
import StudentPerformance from "views/student/default/components/StudentPerformance";
import { AuthContext } from "components/Auth-context";
import TestCard from "views/student/test/components/TestCard";
import { IoMdAlarm } from "react-icons/io";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const auth = useContext(AuthContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10 seconds to keep timers/sections fresh
    return () => clearInterval(timer);
  }, []);

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

        setTests(testData.tests || []);
        setStudent(studentData.student || null);

        if (studentData.student && studentData.student.studentId) {
          const scoreResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/attempted/tests/bystudentId/${studentData.student.studentId}`
          );

          if (!scoreResponse.ok) {
            throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
          }

          const scoreData = await scoreResponse.json();
          setAttempted(scoreData.tests || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [auth.userId]);

  // Helper to parse "YYYY-MM-DD" or "DD-MM-YYYY" and "HH:mm" into a local Date object
  const parseTestDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date(0);
    let year, month, day;
    // Handle both "-" and "/" as separators
    const parts = dateStr.split(/[-/]/).map(Number);
    if (parts[0] > 1000) {
      // Format: YYYY-MM-DD
      [year, month, day] = parts;
    } else if (parts[2] > 1000) {
      // Format: DD-MM-YYYY
      [day, month, year] = parts;
    } else {
      // Fallback
      [year, month, day] = parts;
    }

    // Time format: HH:mm
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0);
  };

  const filteredTests = tests.filter((test) => {
    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );
    const isSameBatch = student && student.batch === test.batchName;

    // Expiration check: Use local date/time objects
    const testEndTime = parseTestDateTime(test.date, test.endTime);
    const isExpired = currentTime > testEndTime;

    return !isTestAttempted && isSameBatch && !isExpired;
  });

  const attemptedTestsCount = tests.length - filteredTests.length;

  const activeTests = filteredTests.filter((test) => {
    const startTime = parseTestDateTime(test.date, test.startTime);
    const endTime = parseTestDateTime(test.date, test.endTime);
    // Current test if: currentTime is within [startTime, endTime]
    return currentTime >= startTime && currentTime <= endTime;
  });

  const upcomingTests = filteredTests.filter((test) => {
    const startTime = parseTestDateTime(test.date, test.startTime);
    // Upcoming if: startTime is in the future AND it's not currently active
    return (
      startTime > currentTime &&
      !activeTests.some(at => at.testId === test.testId)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Widgets Section */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Ranking tests={attempted} />
        <PapersSolved attemptedTests={attemptedTestsCount} />
        <Upcoming unattemptedTests={upcomingTests} />
      </div>

      {/* Balanced Graph System - 1x2 Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-1">
          <StudentPerformance tests={tests} attemptedScores={attempted} />
        </div>
        <div className="col-span-1">
          <div className="h-full rounded-[20px] bg-white dark:bg-navy-800 p-2 min-h-[350px]">
            <MiniCalendar
              value={calendarValue}
              onChange={setCalendarValue}
              exams={filteredTests}
            />
          </div>
        </div>
      </div>

      {/* Active Exams Section - Compact UI */}
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
                <TestCard test={test} isActive={true} />
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

      {/* Upcoming Exams Section - Compact UI */}
      <div className="flex flex-col mb-4">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3 px-1">
          Upcoming Exams
        </h4>
        <div className="flex flex-wrap gap-4">
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <div key={test.testId} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] transition-all duration-300 hover:translate-y-[-4px]">
                <TestCard test={test} isActive={false} />
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
