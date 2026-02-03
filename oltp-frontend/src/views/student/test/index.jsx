import Banner from "./components/Banner";

import { Link, Navigate } from "react-router-dom";
// import tableDataTopCreators from "views/admin/batch/variables/tableDataTopCreators.json";
// import { tableColumnsTopCreators } from "views/admin/batch/variables/tableColumnsTopCreators";

import TopStudentsTable from "./components/TableTopStudents";

import HistoryCard from "./components/HistoryCard";
import TestCard from "./components/TestCard";
import BetaLogo from "./variables/bata_logo.png";
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

  const filteredTests = tests.filter((test) => {
    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );
    const isSameBatch = student.batch === test.batchName;

    // Construct start and end time Date objects using the date attribute and startTime/endTime
    const startTime = new Date(`${test.date} ${test.startTime}`);
    const endTime = new Date(`${test.date} ${test.endTime}`);
    // Get the current time
    const currentTime = new Date();

    // Check if the current time is after the start time and before the end time
    const isTestWithinTimeRange =
      currentTime >= startTime && currentTime <= endTime;
    console.log(isTestWithinTimeRange);
    return !isTestAttempted && isSameBatch && isTestWithinTimeRange;
  });

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* NFt Banner */}
        <Banner1 />

        {/* NFt Header */}
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Exam
          </h4>
        </div>

        {/* NFTs trending card */}
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {filteredTests.map((test) => (
            <>
              <TestCard
                key={test.testId} // Move the key prop to TestCard component
                title={test.examName}
                image={BetaLogo}
                score={test.score}
                course={test.course}
                batchName={test.batchName}
                handleClick={test.handleClick}
                testId={test.testId}
              />
            </>
          ))}
        </div>
      </div>

      {/* right side section */}
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1">
        <TopCreatorTable
          extra="mb-1"
          tableData={tableDataTopCreators}
          columnsData={tableColumnsTopCreators}
        />
      </div>
    </div>
  );
};

export default Marketplace;
