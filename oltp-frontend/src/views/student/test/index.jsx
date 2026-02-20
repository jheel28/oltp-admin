import TestCard from "./components/TestCard";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import TopCreatorTable from "../marketplace/components/TableTopCreators";
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
    if (!student || !test) return false;

    const isTestAttempted = attempted.some(
      (attemptedTest) => attemptedTest.testId === test.testId
    );

    // Use case-insensitive comparison and trim for safety
    const isSameBatch =
      student.batch?.trim().toLowerCase() ===
      test.batchName?.trim().toLowerCase();

    // Construct end time Date object
    const endTime = new Date(`${test.date} ${test.endTime}`);
    const currentTime = new Date();

    // Show tests that have not yet ended
    const isTestNotExpired = currentTime <= endTime;

    return !isTestAttempted && isSameBatch && isTestNotExpired;
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
        <div className="mt-8 flex flex-wrap gap-4">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div
                key={test.testId}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]"
              >
                <TestCard test={test} />
              </div>
            ))
          ) : (
            <div className="w-full rounded-2xl bg-gray-50 py-20 text-center dark:bg-navy-800">
              <p className="font-bold text-gray-500">
                No upcoming tests for your batch.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Check back later or contact your mentor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* right side section */}
      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1">
        <TopCreatorTable />
      </div>
    </div>
  );
};

export default Marketplace;
