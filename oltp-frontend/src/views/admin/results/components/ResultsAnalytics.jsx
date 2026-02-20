import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { MdSearch, MdDownload } from "react-icons/md";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const BAR_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

const MiniBar = ({ label, value, max, color }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-xs text-gray-500 truncate text-right flex-shrink-0">{label}</span>
    <div className="flex-1 h-5 rounded-full bg-gray-100 dark:bg-navy-700 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, backgroundColor: color }}
      />
    </div>
    <span className="w-8 text-xs font-bold text-navy-700 dark:text-white text-right">{value}</span>
  </div>
);

const ScoreBar = ({ range, count, max }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs font-bold text-navy-700 dark:text-white">{count}</span>
    <div className="w-10 bg-gray-100 dark:bg-navy-700 rounded-t" style={{ height: "80px" }}>
      <div
        className="w-full bg-blue-500 rounded-t transition-all duration-700"
        style={{ height: `${max > 0 ? (count / max) * 80 : 0}px`, marginTop: "auto" }}
      />
    </div>
    <span className="text-[10px] text-gray-400">{range}</span>
  </div>
);

const ResultsAnalytics = () => {
  const auth = useContext(AuthContext);
  const [scores, setScores] = useState([]);
  const [tests, setTests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [testFilter, setTestFilter] = useState("All");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, tRes, bRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/all/scores`, {
          headers: { Authorization: "Bearer " + auth.token },
        }),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`),
      ]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      const bData = await bRes.json();
      setScores(sData.scores || []);
      setTests(tData.tests || []);
      setBatches(bData.batches || []);
    } catch {
      message.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    let list = scores;
    if (batchFilter !== "All") list = list.filter((s) => s.batch === batchFilter || s.studentBatch === batchFilter);
    if (testFilter !== "All") list = list.filter((s) => s.testId === testFilter || s.testName === testFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.studentName?.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.testName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [scores, batchFilter, testFilter, search]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const marks = filtered.map((s) => Number(s.marksObtained) || 0);
    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / marks.length;
    const max = Math.max(...marks);
    const min = Math.min(...marks);
    const passed = filtered.filter((s) => s.passed || s.result === "pass").length;

    // Score distribution (0-20%, 20-40%, ... 80-100%)
    const distribution = [0, 0, 0, 0, 0];
    filtered.forEach((s) => {
      const pct = s.totalMarks > 0 ? (Number(s.marksObtained) / s.totalMarks) * 100 : 0;
      const idx = Math.min(Math.floor(pct / 20), 4);
      distribution[idx]++;
    });

    // Per-test breakdown
    const byTest = {};
    filtered.forEach((s) => {
      const key = s.testName || s.testId || "Unknown";
      if (!byTest[key]) byTest[key] = { count: 0, total: 0, passed: 0 };
      byTest[key].count++;
      byTest[key].total += Number(s.marksObtained) || 0;
      if (s.passed || s.result === "pass") byTest[key].passed++;
    });
    const testBreakdown = Object.entries(byTest)
      .map(([name, d]) => ({ name, count: d.count, avg: d.total / d.count, passed: d.passed }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Per-batch breakdown
    const byBatch = {};
    filtered.forEach((s) => {
      const key = s.batch || s.studentBatch || "Unassigned";
      if (!byBatch[key]) byBatch[key] = { count: 0, total: 0 };
      byBatch[key].count++;
      byBatch[key].total += Number(s.marksObtained) || 0;
    });
    const batchBreakdown = Object.entries(byBatch)
      .map(([name, d]) => ({ name, count: d.count, avg: d.total / d.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6);

    return { avg, max, min, passed, distribution, testBreakdown, batchBreakdown };
  }, [filtered]);

  const paginated = useMemo(() => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const distMax = stats ? Math.max(...stats.distribution) : 1;

  const exportCSV = () => {
    const rows = [["Student Name", "Student ID", "Test Name", "Batch", "Marks Obtained", "Total Marks", "Percentage", "Result", "Date"]];
    filtered.forEach((s) => {
      const pct = s.totalMarks > 0 ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1) : "—";
      rows.push([s.studentName, s.studentId, s.testName, s.batch || s.studentBatch || "", s.marksObtained, s.totalMarks, pct, s.result || (s.passed ? "pass" : "fail"), s.createdAt?.split("T")[0] || ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "results.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search student, test..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
          <select
            value={batchFilter}
            onChange={(e) => { setBatchFilter(e.target.value); setPage(0); }}
            className="py-2 px-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
          </select>
          <select
            value={testFilter}
            onChange={(e) => { setTestFilter(e.target.value); setPage(0); }}
            className="py-2 px-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
          >
            <option value="All">All Tests</option>
            {tests.map((t) => <option key={t._id} value={t.testName}>{t.testName}</option>)}
          </select>
          <button
            onClick={exportCSV}
            className="ml-auto px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
          >
            <MdDownload className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </Card>

      {loading ? (
        <Card extra="w-full p-8 flex items-center justify-center text-gray-400">Loading...</Card>
      ) : (
        <>
          {/* Summary Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Attempts", value: filtered.length, color: "text-blue-600" },
                { label: "Average Score", value: stats.avg.toFixed(1), color: "text-purple-600" },
                { label: "Highest Score", value: stats.max, color: "text-green-600" },
                { label: "Pass Rate", value: `${filtered.length > 0 ? ((stats.passed / filtered.length) * 100).toFixed(0) : 0}%`, color: "text-amber-600" },
              ].map((stat) => (
                <Card key={stat.label} extra="p-4">
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Score Distribution */}
            {stats && (
              <Card extra="p-4">
                <h3 className="text-sm font-bold text-navy-700 dark:text-white mb-4">Score Distribution</h3>
                <div className="flex items-end justify-around gap-2 h-28 pb-2">
                  {stats.distribution.map((count, i) => (
                    <ScoreBar
                      key={i}
                      range={`${i * 20}–${(i + 1) * 20}%`}
                      count={count}
                      max={distMax}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Batch Breakdown */}
            {stats && stats.batchBreakdown.length > 0 && (
              <Card extra="p-4">
                <h3 className="text-sm font-bold text-navy-700 dark:text-white mb-4">Average Score by Batch</h3>
                <div className="space-y-2">
                  {stats.batchBreakdown.map((b, i) => (
                    <MiniBar
                      key={b.name}
                      label={b.name}
                      value={b.avg.toFixed(1)}
                      max={Math.max(...stats.batchBreakdown.map((x) => x.avg))}
                      color={BAR_COLORS[i % BAR_COLORS.length]}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Per-Test Breakdown */}
          {stats && stats.testBreakdown.length > 0 && (
            <Card extra="p-4">
              <h3 className="text-sm font-bold text-navy-700 dark:text-white mb-4">Test Performance Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-navy-600">
                      <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase">Test</th>
                      <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">Attempts</th>
                      <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">Avg Score</th>
                      <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">Passed</th>
                      <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.testBreakdown.map((t, i) => (
                      <tr key={t.name} className="border-b border-gray-100 dark:border-navy-700">
                        <td className="py-2 text-sm font-medium text-navy-700 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                            {t.name}
                          </div>
                        </td>
                        <td className="py-2 text-right text-sm text-gray-600 dark:text-gray-300">{t.count}</td>
                        <td className="py-2 text-right text-sm font-bold text-navy-700 dark:text-white">{t.avg.toFixed(1)}</td>
                        <td className="py-2 text-right text-sm text-green-600">{t.passed}</td>
                        <td className="py-2 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            t.count > 0 && (t.passed / t.count) >= 0.6
                              ? "bg-green-100 text-green-700"
                              : t.count > 0 && (t.passed / t.count) >= 0.4
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-600"
                          }`}>
                            {t.count > 0 ? `${((t.passed / t.count) * 100).toFixed(0)}%` : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Results Table */}
          <Card extra="w-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy-700 dark:text-white">All Results</h3>
              <span className="text-xs text-gray-500">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-navy-600">
                    <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase">Student</th>
                    <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase">Test</th>
                    <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase">Batch</th>
                    <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">Score</th>
                    <th className="pb-2 text-right text-xs font-bold text-gray-500 uppercase">%</th>
                    <th className="pb-2 text-center text-xs font-bold text-gray-500 uppercase">Result</th>
                    <th className="pb-2 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">No results found</td>
                    </tr>
                  ) : (
                    paginated.map((s, i) => {
                      const pct = s.totalMarks > 0 ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1) : null;
                      const passed = s.passed || s.result === "pass";
                      return (
                        <tr key={s._id || i} className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800">
                          <td className="py-2">
                            <p className="text-sm font-medium text-navy-700 dark:text-white">{s.studentName}</p>
                            <p className="text-xs text-gray-400">{s.studentId}</p>
                          </td>
                          <td className="py-2 text-sm text-gray-600 dark:text-gray-300">{s.testName}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">{s.batch || s.studentBatch || "—"}</span>
                          </td>
                          <td className="py-2 text-right text-sm font-bold text-navy-700 dark:text-white">{s.marksObtained}/{s.totalMarks}</td>
                          <td className="py-2 text-right text-sm text-gray-600 dark:text-gray-300">{pct ? `${pct}%` : "—"}</td>
                          <td className="py-2 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {passed ? "Pass" : "Fail"}
                            </span>
                          </td>
                          <td className="py-2 text-xs text-gray-400">{s.createdAt?.split("T")[0] || "—"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
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
        </>
      )}
    </div>
  );
};

export default ResultsAnalytics;