import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import {
  MdRefresh, MdArrowBack, MdOutlineVerifiedUser,
  MdOutlineWarning, MdLeaderboard, MdPeople,
} from "react-icons/md";
import { IoMdAlarm } from "react-icons/io";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const POLL_INTERVAL = 15000; // 15 seconds

const StatusBadge = ({ passed, score, total }) => {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-16 rounded-full bg-gray-100 overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all ${passed ? "bg-green-500" : "bg-red-400"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={`text-xs font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
        {pct}%
      </span>
    </div>
  );
};

const LiveMonitorDashboard = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isExpired, setIsExpired] = useState(false); // <-- New State for Expiration

  const fetchData = useCallback(async () => {
    if (!testId) return;
    try {
      const [liveRes, lbRes, testRes] = await Promise.all([
        fetch(`${BACKEND}/api/v1/score/get/live/status/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
        fetch(`${BACKEND}/api/v1/score/get/leaderboard/bytestid/${testId}`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
        fetch(`${BACKEND}/api/v1/test/get/test/bytestid/${testId}`),
      ]);

      if (liveRes.ok) {
        const { submissions: subs } = await liveRes.json();
        setSubmissions(subs || []);
      }
      if (lbRes.ok) {
        const { leaderboard: lb } = await lbRes.json();
        setLeaderboard(lb || []);
      }
      if (testRes.ok) {
        const { test: t } = await testRes.json();
        setTest(t);
        
        // --- Expiration Logic Check ---
        if (t && t.date && t.endTime) {
          const testEndDateTime = new Date(`${t.date}T${t.endTime}`);
          // If the date parses correctly and the current time is past the end time
          if (!isNaN(testEndDateTime.getTime()) && new Date() > testEndDateTime) {
            setIsExpired(true);
            setAutoRefresh(false); // Force auto-refresh off for historical data
          }
        }
      }
      setLastRefresh(new Date());
    } catch (err) {
      console.error("LiveMonitor fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [testId, auth.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh || isExpired) return; // Stop interval if expired or toggled off
    const iv = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, [autoRefresh, isExpired, fetchData]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const passed = submissions.filter((s) => s.passed).length;
    const avgMarks = total > 0
      ? submissions.reduce((a, b) => a + (b.marksObtained || 0), 0) / total
      : 0;
    return { total, passed, failed: total - passed, avgMarks };
  }, [submissions]);

  const deleteAllScores = async () => {
    if (!window.confirm(`Delete ALL scores for test ${testId}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${BACKEND}/api/v1/score/delete/scores/bytestid/${testId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + auth.token },
      });
      if (!res.ok) throw new Error();
      message.success("All scores deleted");
      fetchData();
    } catch {
      message.error("Failed to delete scores");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              <MdArrowBack className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-navy-700 dark:text-white flex items-center gap-2">
                {/* Only show pinging red dot if test is NOT expired */}
                {!isExpired && <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />}
                {isExpired ? "Historical Results (Ended)" : "Live Monitor"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {test?.testName || testId}
                {lastRefresh && ` · Last refreshed ${lastRefresh.toLocaleTimeString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Only show auto-refresh toggle if test is NOT expired */}
            {!isExpired && (
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer mr-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                Auto-refresh (15s)
              </label>
            )}
            <button
              onClick={fetchData}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              title="Manual Refresh"
            >
              <MdRefresh className="h-4 w-4" />
            </button>
            <button
              onClick={deleteAllScores}
              className="px-3 py-2 text-xs rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
            >
              Reset Scores
            </button>
          </div>
        </div>

        {/* Test info strip */}
        {test && (
          <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-gray-50 dark:bg-navy-800 p-3 text-xs">
            {[
              ["Date", test.date],
              ["Time", `${test.startTime} – ${test.endTime}`],
              ["Duration", `${test.duration} min`],
              ["Batch", test.batchName],
              ["Total Marks", test.totalMarks],
              ["Questions", test.totalQuestions],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
                <p className="font-bold text-navy-700 dark:text-white">{value || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Submissions", value: stats.total, icon: <MdPeople />, color: "text-blue-600" },
          { label: "Passed", value: stats.passed, icon: <MdOutlineVerifiedUser />, color: "text-green-600" },
          { label: "Failed", value: stats.failed, icon: <MdOutlineWarning />, color: "text-red-500" },
          { label: "Avg Marks", value: stats.avgMarks.toFixed(1), icon: <IoMdAlarm />, color: "text-purple-600" },
        ].map((s) => (
          <Card key={s.label} extra="p-4">
            <div className={`text-2xl mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card extra="w-full p-4">
        <div className="flex gap-1 border-b border-gray-100 dark:border-navy-700 mb-4">
          {[
            { id: "live", label: "Submissions", icon: <MdPeople className="h-4 w-4" /> },
            { id: "leaderboard", label: "Leaderboard", icon: <MdLeaderboard className="h-4 w-4" /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {icon} {label}
              <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {id === "live" ? submissions.length : leaderboard.length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  {activeTab === "live" ? (
                    ["#", "Student", "Batch", "Score", "Performance", "Result", "Submitted At"].map((h) => (
                      <th key={h} className="pb-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                    ))
                  ) : (
                    ["Rank", "Student", "Batch", "Score", "Performance", "Result"].map((h) => (
                      <th key={h} className="pb-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === "live" && submissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                      {isExpired ? "No submissions were recorded for this test." : "No submissions yet. The monitor refreshes automatically."}
                    </td>
                  </tr>
                )}
                {activeTab === "live" && submissions.map((s, i) => (
                  <tr key={s.studentId + i} className="border-b border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800 transition">
                    <td className="py-2.5 pr-4 text-sm text-gray-400">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <p className="text-sm font-medium text-navy-700 dark:text-white">{s.studentName || "—"}</p>
                      <p className="text-[11px] text-gray-400">{s.studentId}</p>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30">
                        {s.batch || "—"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-sm font-bold text-navy-700 dark:text-white">
                      {s.marksObtained}
                      <span className="text-gray-400 font-normal">/{s.totalMarks}</span>
                    </td>
                    <td className="py-2.5 pr-4 w-36">
                      <StatusBadge passed={s.passed} score={s.marksObtained} total={s.totalMarks} />
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {s.passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] text-gray-400">
                      {s.submittedAt ? new Date(s.submittedAt).toLocaleTimeString() : "—"}
                    </td>
                  </tr>
                ))}
                {activeTab === "leaderboard" && leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                      No results available yet.
                    </td>
                  </tr>
                )}
                {activeTab === "leaderboard" && leaderboard.map((s) => (
                  <tr key={s.studentId} className={`border-b border-gray-50 dark:border-navy-700 transition ${
                    s.rank <= 3 ? "bg-amber-50/50 dark:bg-amber-900/10" : "hover:bg-gray-50 dark:hover:bg-navy-800"
                  }`}>
                    <td className="py-2.5 pr-4">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                        s.rank === 1 ? "bg-amber-400 text-white" :
                        s.rank === 2 ? "bg-gray-300 text-gray-800" :
                        s.rank === 3 ? "bg-orange-400 text-white" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {s.rank}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <p className="text-sm font-medium text-navy-700 dark:text-white">{s.studentName || "—"}</p>
                      <p className="text-[11px] text-gray-400">{s.studentId}</p>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700">
                        {s.batch || "—"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-sm font-bold text-navy-700 dark:text-white">
                      {s.marksObtained}<span className="text-gray-400 font-normal">/{s.totalMarks}</span>
                    </td>
                    <td className="py-2.5 pr-4 w-36">
                      <StatusBadge passed={s.passed} score={s.marksObtained} total={s.totalMarks} />
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {s.passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LiveMonitorDashboard;