import React, { useContext, useEffect, useMemo, useState } from "react";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const TestsTable = () => {
  const [scores, setScores] = useState([]);
  const [student, setStudent] = useState({});
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`
        );
        if (!studentResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentResponse.status}`);
        }
        const studentData = await studentResponse.json();
        setStudent(studentData.student);

        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/attempted/tests/bystudentid/${studentData.student.studentId}`
        );
        if (!scoreResponse.ok) {
          throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
        }
        const scoreData = await scoreResponse.json();
        setScores(scoreData.tests || []);
      } catch (err) {
        message.error("Error fetching scores: " + err.message);
      }
    };
    fetchScores();
  }, [auth.userId]);

  // Build rows: each score = one row, with attempt number for repeated tests
  const rows = useMemo(() => {
    // Group scores by testId to calculate attempt numbers
    const grouped = {};
    // scores are sorted by createdAt desc from backend, reverse to get chronological order
    const chronological = [...scores].reverse();
    chronological.forEach((s) => {
      if (!grouped[s.testId]) grouped[s.testId] = [];
      grouped[s.testId].push(s);
    });

    // Assign attempt numbers (earliest = #1)
    const withAttempts = {};
    Object.keys(grouped).forEach((testId) => {
      grouped[testId].forEach((s, i) => {
        withAttempts[s._id] = i + 1;
      });
    });

    // Return in original order (newest first)
    return scores.map((s) => ({
      _id: s._id,
      testId: s.testId,
      testName: s.testName || s.testId,
      paperId: s.paperId,
      marksObtained: s.marksObtained,
      totalMarks: s.totalMarks,
      percentage: s.percentage,
      passed: s.passed,
      attempt: withAttempts[s._id] || 1,
      totalAttempts: grouped[s.testId]?.length || 1,
      date: s.createdAt
        ? new Date(s.createdAt).toLocaleDateString()
        : "—",
      time: s.createdAt
        ? new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
    }));
  }, [scores]);

  const paginated = rows.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  const handleViewResults = (scoreId) => {
    navigate(`result-page/score/${scoreId}`);
  };

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between mb-6">
        <div>
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Tests Results
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{rows.length} attempt{rows.length !== 1 ? "s" : ""} total</p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-navy-600">
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Test ID</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Test Name</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Attempt</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Marks</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">%</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Result</th>
              <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Submitted</th>
              <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">View</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                  No test results yet.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row._id} className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-6 text-sm text-navy-700 dark:text-white font-medium">{row.testId}</td>
                  <td className="py-3 pr-6 text-sm text-gray-600 dark:text-gray-300">{row.testName}</td>
                  <td className="py-3 pr-6">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
                      #{row.attempt}{row.totalAttempts > 1 ? ` / ${row.totalAttempts}` : ""}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-sm font-bold text-navy-700 dark:text-white">
                    {row.marksObtained}<span className="text-gray-400 font-normal">/{row.totalMarks}</span>
                  </td>
                  <td className="py-3 pr-6 text-sm text-gray-600 dark:text-gray-300">{row.percentage}%</td>
                  <td className="py-3 pr-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.passed ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"}`}>
                      {row.passed ? "Pass" : "Fail"}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-sm text-gray-500">
                    {row.date}{row.time ? `, ${row.time}` : ""}
                  </td>
                  <td className="py-3">
                    <button
                      className="rounded-full bg-teal-500 px-4 py-2 text-white text-xs font-bold hover:bg-teal-500 transition"
                      onClick={() => handleViewResults(row._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(0)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{"<<"}</button>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{"<"}</button>
            <span className="px-3 py-1 text-xs">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{">"}</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{">>"}</button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TestsTable;