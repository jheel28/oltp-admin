import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdRefresh, MdSearch, MdDownload } from "react-icons/md";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const TestMonitor = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [testRes, scoresRes] = await Promise.all([
        fetch(`${BACKEND}/api/v1/test/get/test/bytestid/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
        fetch(`${BACKEND}/api/v1/score/get/scores/bytestid/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
      ]);

      if (testRes.ok) {
        const { test: t } = await testRes.json();
        setTest(t);
      }

      if (scoresRes.ok) {
        const { scores: s = [] } = await scoresRes.json();
        setScores(s);
      }
    } catch {
      message.error("Failed to load test data");
    } finally {
      setLoading(false);
    }
  }, [testId, auth.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = scores.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.studentName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q)
    );
  });

  const totalAttempts = scores.length;
  const passed = scores.filter((s) => s.passed).length;
  const avgScore = totalAttempts > 0
    ? (scores.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0) / totalAttempts).toFixed(1)
    : "—";
  const passRate = totalAttempts > 0 ? ((passed / totalAttempts) * 100).toFixed(0) : "—";

  const exportCSV = () => {
    const rows = [["Student", "Student ID", "Marks", "Total", "%", "Result", "Date"]];
    filtered.forEach((s) => {
      const pct = s.totalMarks > 0 ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1) : "";
      rows.push([s.studentName, s.studentId, s.marksObtained, s.totalMarks, pct, s.passed ? "Pass" : "Fail", s.createdAt?.split("T")[0] || ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${testId}-results.csv`; a.click();
  };

  return (
    <div className="space-y-4 mt-3">
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-400 transition"
            >
              <MdArrowBack className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-navy-700 dark:text-white">
                {test?.testName || testId}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Test ID: {testId}
                {test?.batchName && ` · Batch: ${test.batchName}`}
                {test?.date && ` · ${test.date}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>
            <button
              onClick={fetchData}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              title="Refresh"
            >
              <MdRefresh className="h-4 w-4" />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            >
              <MdDownload className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: totalAttempts, color: "text-blue-600" },
          { label: "Average Score", value: avgScore, color: "text-purple-600" },
          { label: "Passed", value: passed, color: "text-green-600" },
          { label: "Pass Rate", value: totalAttempts > 0 ? `${passRate}%` : "—", color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} extra="p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card extra="w-full p-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {scores.length === 0 ? "No submissions yet for this test." : "No results match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["#", "Student", "Student ID", "Marks", "%", "Result", "Submitted"].map((h) => (
                    <th key={h} className={`pb-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider pr-4 ${
                      ["Marks", "%"].includes(h) ? "text-right" : h === "Result" ? "text-center" : "text-left"
                    }`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const pct = s.totalMarks > 0 ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1) : null;
                  return (
                    <tr key={s._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-2.5 pr-4 text-xs text-gray-400">{i + 1}</td>
                      <td className="py-2.5 pr-4 text-sm font-medium text-navy-700">{s.studentName || "—"}</td>
                      <td className="py-2.5 pr-4 text-xs text-gray-500">{s.studentId}</td>
                      <td className="py-2.5 pr-4 text-right text-sm font-bold text-navy-700">
                        {s.marksObtained}<span className="text-gray-400 font-normal">/{s.totalMarks}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-right text-sm text-gray-500">{pct ? `${pct}%` : "—"}</td>
                      <td className="py-2.5 pr-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}>
                          {s.passed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-gray-400">
                        {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestMonitor;