import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdDownload,
  MdRefresh,
  MdBarChart,
  MdTableChart,
  MdEdit,
  MdDelete,
  MdClose,
  MdMonitor,
} from "react-icons/md";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const BAR_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
];

const StatCard = ({ label, value, color, sub }) => (
  <Card extra="p-4">
    <p className="mb-1 text-xs text-gray-400">{label}</p>
    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
    {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
  </Card>
);

const MiniBar = ({ label, value, max, color }) => (
  <div className="flex items-center gap-3">
    <span className="w-28 flex-shrink-0 truncate text-right text-xs text-gray-500">
      {label}
    </span>
    <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${max > 0 ? (Number(value) / max) * 100 : 0}%`,
          backgroundColor: color,
        }}
      />
    </div>
    <span className="w-12 flex-shrink-0 text-right text-xs font-bold text-navy-700">
      {typeof value === "number" ? value.toFixed(1) : value}
    </span>
  </div>
);

const BarChart = ({ data, max }) => (
  <div className="flex h-28 items-end justify-around gap-1 pb-1">
    {data.map(({ label, value, color }) => (
      <div key={label} className="flex flex-1 flex-col items-center gap-1">
        <span className="text-[10px] font-bold text-navy-700">{value}</span>
        <div
          className="w-full rounded-t bg-gray-100"
          style={{ height: "80px" }}
        >
          <div
            className="w-full rounded-t transition-all duration-700"
            style={{
              height: `${max > 0 ? (value / max) * 80 : 0}px`,
              backgroundColor: color,
              marginTop: "auto",
            }}
          />
        </div>
        <span className="text-center text-[9px] leading-tight text-gray-400">
          {label}
        </span>
      </div>
    ))}
  </div>
);

const PAGE_SIZE = 15;

const ResultsDashboard = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [tests, setTests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("analytics");
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [testFilter, setTestFilter] = useState("All");
  const [page, setPage] = useState(0);

  const [editScoreData, setEditScoreData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, tRes, bRes] = await Promise.all([
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/all/scores`,
          { headers: { Authorization: "Bearer " + auth.token } }
        ),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`),
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`
        ),
      ]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      const bData = await bRes.json();
      setScores(sData.scores || []);
      setTests(tData.tests || []);
      setBatches(bData.batches || []);
    } catch {
      message.error("Failed to load results data");
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDeleteScore = async (scoreId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this result? This cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/delete/single/${scoreId}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + auth.token },
        }
      );
      if (!response.ok) throw new Error("Failed to delete score");
      message.success("Score deleted successfully");
      setScores((prev) => prev.filter((s) => s._id !== scoreId));
    } catch {
      message.error("Error deleting score");
    }
  };

  const submitScoreEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/update/${editScoreData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            marksObtained: editScoreData.marksObtained,
            passed: editScoreData.passed,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update score");
      const resData = await response.json();
      message.success("Score updated successfully");
      setScores((prev) =>
        prev.map((s) => (s._id === editScoreData._id ? resData.score : s))
      );
      setIsEditModalOpen(false);
    } catch {
      message.error("Error updating score");
    }
  };

  const filtered = useMemo(() => {
    let list = scores;
    if (batchFilter !== "All")
      list = list.filter((s) => s.batch === batchFilter);
    if (testFilter !== "All")
      list = list.filter(
        (s) => s.testId === testFilter || s.testName === testFilter
      );
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
    const visibleTests =
      testFilter === "All"
        ? tests
        : tests.filter((t) => t.testId === testFilter);

    const byTest = {};
    visibleTests.forEach((t) => {
      byTest[t.testId] = {
        name: t.testName || t.testId,
        count: 0,
        total: 0,
        passed: 0,
        testId: t.testId,
      };
    });

    filtered.forEach((s) => {
      const key = s.testId || "unknown";
      if (!byTest[key]) {
        byTest[key] = {
          name: s.testName || s.testId,
          count: 0,
          total: 0,
          passed: 0,
          testId: key,
        };
      }
      byTest[key].count++;
      byTest[key].total += Number(s.marksObtained) || 0;
      if (s.passed) byTest[key].passed++;
    });

    const testBreakdown = Object.values(byTest)
      .map((d) => ({ ...d, avg: d.count > 0 ? d.total / d.count : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    if (!filtered.length) {
      return {
        avg: 0,
        max: 0,
        min: 0,
        passed: 0,
        distribution: [0, 0, 0, 0, 0],
        testBreakdown,
        batchBreakdown: [],
        hasScores: false,
      };
    }

    const marks = filtered.map((s) => Number(s.marksObtained) || 0);
    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / marks.length;
    const max = Math.max(...marks);
    const min = Math.min(...marks);
    const passed = filtered.filter((s) => s.passed).length;

    const distribution = [0, 0, 0, 0, 0];
    filtered.forEach((s) => {
      const pct =
        s.totalMarks > 0 ? (Number(s.marksObtained) / s.totalMarks) * 100 : 0;
      distribution[Math.min(Math.floor(pct / 20), 4)]++;
    });

    const byBatch = {};
    filtered.forEach((s) => {
      const key = s.batch || "Unassigned";
      if (!byBatch[key]) byBatch[key] = { count: 0, total: 0 };
      byBatch[key].count++;
      byBatch[key].total += Number(s.marksObtained) || 0;
    });
    const batchBreakdown = Object.entries(byBatch)
      .map(([name, d]) => ({ name, count: d.count, avg: d.total / d.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6);

    return {
      avg,
      max,
      min,
      passed,
      distribution,
      testBreakdown,
      batchBreakdown,
      hasScores: true,
    };
  }, [filtered, tests, testFilter]);

  const paginated = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const distMax = stats?.hasScores ? Math.max(...stats.distribution, 1) : 1;

  const exportCSV = () => {
    const rows = [
      [
        "Student",
        "Student ID",
        "Test",
        "Batch",
        "Marks",
        "Total",
        "%",
        "Result",
        "Date",
      ],
    ];
    filtered.forEach((s) => {
      const pct =
        s.totalMarks > 0
          ? ((Number(s.marksObtained) / s.totalMarks) * 100).toFixed(1)
          : "";
      rows.push([
        s.studentName,
        s.studentId,
        s.testName,
        s.batch || "",
        s.marksObtained,
        s.totalMarks,
        pct,
        s.passed ? "Pass" : "Fail",
        s.createdAt?.split("T")[0] || "",
      ]);
    });
    const csv = rows
      .map((r) => r.map((c) => `"${c ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "results.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">
              Results Dashboard
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {scores.length} total attempts across {tests.length} tests
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
            </div>
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            >
              <option value="All">All Batches</option>
              {batches.map((b) => (
                <option key={b._id} value={b.batchName}>
                  {b.batchName}
                </option>
              ))}
            </select>
            <select
              value={testFilter}
              onChange={(e) => {
                setTestFilter(e.target.value);
                setPage(0);
              }}
              className="rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            >
              <option value="All">All Tests</option>
              {tests.map((t) => (
                <option key={t._id} value={t.testId}>
                  {t.testName || t.testId}
                </option>
              ))}
            </select>
            <button
              onClick={fetchAll}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
            >
              <MdRefresh className="h-4 w-4" />
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-sm text-white transition hover:bg-green-600"
            >
              <MdDownload className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-1 border-b border-gray-100 dark:border-navy-700">
          {[
            { id: "analytics", label: "Analytics", icon: MdBarChart },
            { id: "table", label: "All Results", icon: MdTableChart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition ${
                activeView === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
              {id === "table" && (
                <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card extra="w-full p-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="border-t-transparent h-8 w-8 animate-spin rounded-full border-2 border-blue-500" />
            <span className="text-sm">Loading results…</span>
          </div>
        </Card>
      ) : (
        <>
          {activeView === "analytics" && (
            <>
              {stats?.hasScores && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatCard
                    label="Total Attempts"
                    value={filtered.length}
                    color="text-blue-600"
                  />
                  <StatCard
                    label="Average Score"
                    value={stats.avg.toFixed(1)}
                    color="text-purple-600"
                    sub={`Min: ${stats.min} · Max: ${stats.max}`}
                  />
                  <StatCard
                    label="Highest Score"
                    value={stats.max}
                    color="text-green-600"
                  />
                  <StatCard
                    label="Pass Rate"
                    value={`${
                      filtered.length > 0
                        ? ((stats.passed / filtered.length) * 100).toFixed(0)
                        : 0
                    }%`}
                    color="text-amber-600"
                    sub={`${stats.passed} of ${filtered.length} passed`}
                  />
                </div>
              )}

              {stats?.hasScores && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Card extra="p-4">
                    <h3 className="mb-4 text-sm font-bold text-navy-700">
                      Score Distribution
                    </h3>
                    <BarChart
                      data={stats.distribution.map((v, i) => ({
                        label: `${i * 20}–${(i + 1) * 20}%`,
                        value: v,
                        color: [
                          "#EF4444",
                          "#F97316",
                          "#F59E0B",
                          "#84CC16",
                          "#10B981",
                        ][i],
                      }))}
                      max={distMax}
                    />
                  </Card>
                  {stats.batchBreakdown.length > 0 && (
                    <Card extra="p-4">
                      <h3 className="mb-4 text-sm font-bold text-navy-700">
                        Avg Score by Batch
                      </h3>
                      <div className="space-y-2.5">
                        {stats.batchBreakdown.map((b, i) => (
                          <MiniBar
                            key={b.name}
                            label={b.name}
                            value={b.avg}
                            max={Math.max(
                              ...stats.batchBreakdown.map((x) => x.avg),
                              1
                            )}
                            color={BAR_COLORS[i % BAR_COLORS.length]}
                          />
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {stats?.testBreakdown.length > 0 && (
                <Card extra="p-4">
                  <h3 className="mb-4 text-sm font-bold text-navy-700">
                    Test Performance Summary
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {[
                            "Test",
                            "Attempts",
                            "Avg Score",
                            "Passed",
                            "Pass Rate",
                            "Monitor",
                          ].map((h) => (
                            <th
                              key={h}
                              className={`pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                                h === "Test" ? "text-left" : "text-right"
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.testBreakdown.map((t, i) => (
                          <tr
                            key={t.testId}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2.5 text-sm font-medium text-navy-700">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 flex-shrink-0 rounded-full"
                                  style={{
                                    backgroundColor:
                                      BAR_COLORS[i % BAR_COLORS.length],
                                  }}
                                />
                                <span className="max-w-[200px] truncate">
                                  {t.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 text-right text-sm text-gray-500">
                              {t.count}
                            </td>
                            <td className="py-2.5 text-right text-sm font-bold text-navy-700">
                              {t.count > 0 ? t.avg.toFixed(1) : "—"}
                            </td>
                            <td className="py-2.5 text-right text-sm text-green-600">
                              {t.passed}
                            </td>
                            <td className="py-2.5 text-right">
                              {t.count > 0 ? (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                    t.passed / t.count >= 0.6
                                      ? "bg-green-100 text-green-700"
                                      : t.passed / t.count >= 0.4
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {`${((t.passed / t.count) * 100).toFixed(
                                    0
                                  )}%`}
                                </span>
                              ) : (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-400">
                                  No data
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right">
                              {/* FIXED: was /monitor/, now /live/ to match the route in results/index.jsx */}
                              <button
                                onClick={() =>
                                  navigate(`/admin/results/live/${t.testId}`)
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 transition hover:bg-blue-100"
                              >
                                <MdMonitor className="h-3 w-3" /> Monitor
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {(!stats || stats.testBreakdown.length === 0) && (
                <Card extra="w-full p-16 flex items-center justify-center text-gray-400">
                  <p className="text-sm">
                    No tests found. Create a test to get started.
                  </p>
                </Card>
              )}
            </>
          )}

          {activeView === "table" && (
            <Card extra="w-full p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {[
                        "Student",
                        "Test",
                        "Batch",
                        "Score",
                        "%",
                        "Result",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`pb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${
                            ["Score", "%"].includes(h)
                              ? "text-right"
                              : h === "Result" || h === "Actions"
                              ? "text-center"
                              : "text-left"
                          } pr-4`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-16 text-center text-sm text-gray-400"
                        >
                          No results found
                        </td>
                      </tr>
                    ) : (
                      paginated.map((s, i) => {
                        const pct =
                          s.totalMarks > 0
                            ? (
                                (Number(s.marksObtained) / s.totalMarks) *
                                100
                              ).toFixed(1)
                            : null;
                        return (
                          <tr
                            key={s._id || i}
                            className="border-b border-gray-50 transition hover:bg-gray-50"
                          >
                            <td className="py-2.5 pr-4">
                              <p className="text-sm font-medium text-navy-700">
                                {s.studentName || "—"}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {s.studentId}
                              </p>
                            </td>
                            <td className="max-w-[180px] truncate py-2.5 pr-4 text-sm text-gray-600">
                              {s.testName || s.testId}
                            </td>
                            <td className="py-2.5 pr-4">
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700">
                                {s.batch || "—"}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 text-right text-sm font-bold text-navy-700">
                              {s.marksObtained}
                              <span className="font-normal text-gray-400">
                                /{s.totalMarks}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 text-right text-sm text-gray-500">
                              {pct ? `${pct}%` : "—"}
                            </td>
                            <td className="py-2.5 pr-4 text-center">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                  s.passed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {s.passed ? "Pass" : "Fail"}
                              </span>
                            </td>
                            <td className="py-2.5 text-[11px] text-gray-400">
                              {s.createdAt?.split("T")[0] || "—"}
                            </td>
                            <td className="py-2.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditScoreData(s);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="rounded p-1 text-blue-500 transition hover:bg-blue-50"
                                  title="Edit Result"
                                >
                                  <MdEdit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteScore(s._id)}
                                  className="rounded p-1 text-red-500 transition hover:bg-red-50"
                                  title="Delete Result"
                                >
                                  <MdDelete className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400">
                    Showing {page * PAGE_SIZE + 1}–
                    {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
                    {filtered.length}
                  </p>
                  <div className="flex gap-1">
                    {[
                      {
                        label: "«",
                        action: () => setPage(0),
                        disabled: page === 0,
                      },
                      {
                        label: "‹",
                        action: () => setPage((p) => p - 1),
                        disabled: page === 0,
                      },
                      {
                        label: "›",
                        action: () => setPage((p) => p + 1),
                        disabled: page >= totalPages - 1,
                      },
                      {
                        label: "»",
                        action: () => setPage(totalPages - 1),
                        disabled: page >= totalPages - 1,
                      },
                    ].map(({ label, action, disabled }) => (
                      <button
                        key={label}
                        onClick={action}
                        disabled={disabled}
                        className="rounded border border-gray-200 px-2.5 py-1 text-sm transition hover:bg-gray-50 disabled:opacity-40"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {isEditModalOpen && editScoreData && (
        <div className="bg-black fixed inset-0 z-[100] flex items-center justify-center bg-opacity-40 p-4 backdrop-blur-sm">
          <Card extra="w-full max-w-sm p-5 relative shadow-xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <MdClose className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-lg font-bold text-navy-700">
              Edit Result
            </h2>

            <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
              <p>
                <span className="font-semibold">Student:</span>{" "}
                {editScoreData.studentName}
              </p>
              <p>
                <span className="font-semibold">Test:</span>{" "}
                {editScoreData.testName || editScoreData.testId}
              </p>
              <p>
                <span className="font-semibold">Total Marks:</span>{" "}
                {editScoreData.totalMarks}
              </p>
            </div>

            <form onSubmit={submitScoreEdit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editScoreData.marksObtained}
                  onChange={(e) =>
                    setEditScoreData({
                      ...editScoreData,
                      marksObtained: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editScoreData.passed}
                    onChange={(e) =>
                      setEditScoreData({
                        ...editScoreData,
                        passed: e.target.checked,
                      })
                    }
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  Mark as Passed
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-500 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;
