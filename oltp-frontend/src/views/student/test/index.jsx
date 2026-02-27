import TestCard from "./components/TestCard";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";

const parseTestDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const parts = (dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/")).map(Number);
  let year, month, day;
  if (parts[0] > 1000) [year, month, day] = parts;
  else if (parts[2] > 1000) [day, month, year] = parts;
  else [year, month, day] = parts;
  const [h, m] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, h, m, 0);
};

const Marketplace = () => {
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`
        );
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`
        );

        if (!testResponse.ok || !studentResponse.ok) {
          throw new Error(`HTTP error! Status: ${testResponse.status}, ${studentResponse.status}`);
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

  const now = new Date();

  const filteredTests = tests.filter((test) => {
    if (!student || !test) return false;

    if (test.isPublished === false) return false;
    const isSameBatch =
      student.batch?.trim().toLowerCase() === test.batchName?.trim().toLowerCase();
    if (!isSameBatch) return false;

    const hasAttempted = attempted.some((a) => a.testId === test.testId);
    if (test.isPermanent) return true;
    const endTime = parseTestDateTime(test.date, test.endTime);
    const notExpired = endTime ? now <= endTime : false;

    return !hasAttempted && notExpired;
  });

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">

        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">Exam</h4>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => {
              const isActive = test.isPermanent
                ? true
                : (() => {
                    const startTime = parseTestDateTime(test.date, test.startTime);
                    const endTime = parseTestDateTime(test.date, test.endTime);
                    return startTime && endTime ? now >= startTime && now <= endTime : false;
                  })();

              return (
                <div
                  key={test.testId}
                  className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)]"
                >
                  <TestCard test={test} isActive={isActive} />
                </div>
              );
            })
          ) : (
            <div className="w-full rounded-2xl bg-gray-50 py-20 text-center dark:bg-navy-800">
              <p className="font-bold text-gray-500">No upcoming tests for your batch.</p>
              <p className="mt-2 text-sm text-gray-400">Check back later or contact your mentor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;