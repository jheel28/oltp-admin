import Banner from "./components/Banner";

import { Link, Navigate } from "react-router-dom";
// import tableDataTopCreators from "views/admin/batch/variables/tableDataTopCreators.json";
// import { tableColumnsTopCreators } from "views/admin/batch/variables/tableColumnsTopCreators";

import TopStudentsTable from "./components/TableTopStudents";

import HistoryCard from "./components/HistoryCard";
import TestCard from "./components/TestCard";
import logo from "assets/img/Logo/correct.png";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import TestingPlatformHome from "./TestingPlatform/testingPlatformHome";
import TopCreatorTable from "../marketplace/components/TableTopCreators";
import { tableColumnsTopCreators } from "../marketplace/variables/tableColumnsTopCreators";
import tableDataTopCreators from "../marketplace/variables/tableDataTopCreators.json";
import Banner1 from "views/admin/marketplace/components/Banner";

const Marketplace = () => {
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

        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/attempted/tests/bystudentId/${studentData.student.studentId}`
        );

        if (!scoreResponse.ok) {
          throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
        }

        const scoreData = await scoreResponse.json();
        setAttempted(scoreData.tests);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };

    fetchData();
  }, [auth.userId]);

  const activeTests = tests.filter((test) => {
    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );
    // Use robust batch matching (trim and case-insensitive check is safer)
    const isSameBatch = student.batch?.trim().toLowerCase() === test.batchName?.trim().toLowerCase();

    const startTime = new Date(`${test.date} ${test.startTime}`);
    const endTime = new Date(`${test.date} ${test.endTime}`);
    const currentTime = new Date();

    const isActive = currentTime >= startTime && currentTime <= endTime;

    return !isTestAttempted && isSameBatch && isActive;
  });

  const upcomingTests = tests.filter((test) => {
    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );
    const isSameBatch = student.batch?.trim().toLowerCase() === test.batchName?.trim().toLowerCase();

    const startTime = new Date(`${test.date} ${test.startTime}`);
    const currentTime = new Date();

    const isUpcoming = currentTime < startTime;

    return !isTestAttempted && isSameBatch && isUpcoming;
  });

  return (
    <div className="mt-3 h-full">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left Section: Exams */}
        <div className="col-span-1 h-fit w-full xl:col-span-2">
          <Banner1 />

          {/* Active Exams Section */}
          <div className="mb-4 mt-5 px-4">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
              Active Exams
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Exams you can take right now</p>
          </div>

          <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activeTests.length > 0 ? (
              activeTests.map((test) => (
                <TestCard
                  key={test.testId}
                  title={test.examName}
                  image={logo}
                  score={test.score}
                  course={test.course}
                  batchName={test.batchName}
                  testId={test.testId}
                />
              ))
            ) : (
              <div className="col-span-full p-4 bg-gray-50 rounded-lg text-center text-gray-500 italic">
                No active exams at the moment.
              </div>
            )}
          </div>

          {/* Upcoming Exams Section */}
          <div className="mb-4 mt-8 px-4 border-t pt-5 border-gray-200 dark:border-navy-600">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
              Upcoming Exams
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled for the future</p>
          </div>

          <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTests.length > 0 ? (
              upcomingTests.map((test) => (
                <div key={test.testId} className="relative grayscale opacity-80 pointer-events-none">
                  <div className="absolute top-2 right-2 z-30 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                    UPCOMING: {test.date} {test.startTime}
                  </div>
                  <TestCard
                    title={test.examName}
                    image={logo}
                    score={test.score}
                    course={test.course}
                    batchName={test.batchName}
                    testId={test.testId}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full p-4 bg-gray-50 rounded-lg text-center text-gray-500 italic">
                No upcoming exams scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Stats/Table */}
        <div className="col-span-1 h-full w-full rounded-xl">
          <TopCreatorTable
            extra="mb-1"
            tableData={tableDataTopCreators}
            columnsData={tableColumnsTopCreators}
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
 