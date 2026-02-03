import React, { useContext, useEffect, useState } from "react";

import Ranking from "views/student/default/components/Ranking";
import Upcoming from "views/student/default/components/Upcoming";
import PapersSolved from "views/student/default/components/PapersSolved";
import MiniCalendar from "components/calendar/MiniCalendar";
import StudentPerformance from "views/student/default/components/StudentPerformance";
import Pie from "views/student/default/components/Pie";
import { AuthContext } from "components/Auth-context";

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

    return !isTestAttempted && isSameBatch;
  });
  const attemptedTests = tests.length - filteredTests.length;
  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Ranking />
        <PapersSolved attemptedTests={attemptedTests} />
        <Upcoming unattemptedTests={filteredTests} />
      </div>

      {/* Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StudentPerformance tests={tests} />
        {/* <Pie /> */}
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <MiniCalendar />
        </div>
      </div>

      {/* Upcoming Test & Calender*/}
    </div>
  );
};

export default Dashboard;
