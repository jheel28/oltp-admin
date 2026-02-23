import React, { useEffect, useState, useMemo } from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { MdSearch, MdClose, MdBarChart, MdCheckCircle, MdCancel } from "react-icons/md";
import { IoSchool, IoPerson } from "react-icons/io5";

const StudentFocus = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState([]);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/all/students`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`),
        ]);
        const [sData, tData] = await Promise.all([sRes.json(), tRes.json()]);
        setAllStudents(sData.students || []);
        setAllTests(tData.tests || []);
      } catch (_) {}
    };
    init();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allStudents.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        String(s.studentId || "").toLowerCase().includes(q) ||
        String(s.batch || "").toLowerCase().includes(q)
    );
  }, [query, allStudents]);

  const selectStudent = async (student) => {
    setSelected(student);
    setQuery(`${student.firstName} ${student.lastName}`);
    setDropdownOpen(false);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/scores/bystudentid/${student.studentId}`
      );
      const data = await res.json();
      setScores(data.scores || []);
    } catch (_) {
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setSelected(null);
    setScores([]);
    setQuery("");
    setDropdownOpen(false);
  };

  const chartData = useMemo(() => {
    if (!selected || scores.length === 0) return [];
    return scores
      .map((score) => {
        const testInfo = allTests.find((t) => t.testId === score.testId);
        const label = score.testName || testInfo?.testName || score.testId || "Test";
        const pct = Math.round(
          (parseFloat(score.marksObtained) / (parseFloat(score.totalMarks) || 1)) * 100
        );
        return {
          label,
          pct,
          marks: score.marksObtained,
          total: score.totalMarks,
          passed: score.passed,
          date: new Date(score.createdAt || 0),
        };
      })
      .filter((d) => !isNaN(d.pct))
      .sort((a, b) => a.date - b.date);
  }, [scores, allTests, selected]);

  const avg = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.pct, 0) / chartData.length)
    : 0;
  const passCount = chartData.filter((d) => d.passed).length;

  const lineOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#2563EB"],
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: chartData.map((d) => d.label),
      labels: { style: { colors: "#94A3B8", fontSize: "11px" }, rotate: -20 },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: "#94A3B8", fontSize: "11px" },
        formatter: (v) => `${v}%`,
      },
    },
    tooltip: { theme: "dark", y: { formatter: (v) => `${v}%` } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, xaxis: { lines: { show: false } } },
    markers: { size: 4, colors: ["#2563EB"], strokeColors: "#fff", strokeWidth: 2 },
    annotations: {
      yaxis: [
        {
          y: 35,
          borderColor: "#EF4444",
          strokeDashArray: 4,
          label: {
            text: "Pass (35%)",
            style: { color: "#EF4444", background: "transparent", fontSize: "10px" },
          },
        },
      ],
    },
  };

  const statItems = [
    {
      label: "Tests Taken",
      value: chartData.length,
      icon: <MdBarChart className="h-4 w-4 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Score",
      value: `${avg}%`,
      icon: <MdBarChart className="h-4 w-4 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Passed",
      value: `${passCount}/${chartData.length}`,
      icon: <MdCheckCircle className="h-4 w-4 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Failed",
      value: chartData.length - passCount,
      icon: <MdCancel className="h-4 w-4 text-red-500" />,
      bg: "bg-red-50",
    },
    {
      label: "Admission",
      value: selected?.admissionDate || "—",
      icon: <IoSchool className="h-4 w-4 text-slate-500" />,
      bg: "bg-slate-50",
    },
    {
      label: "Mobile",
      value: selected?.phoneNumber || "—",
      icon: <IoPerson className="h-4 w-4 text-slate-500" />,
      bg: "bg-slate-50",
    },
  ];

  return (
    <Card extra="p-5 w-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <IoPerson className="h-4 w-4 text-white" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 dark:text-white">Individual Student Focus</h4>
      </div>

      <div className="relative mb-5 w-full md:w-[380px]">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 transition-colors focus-within:border-blue-400 focus-within:bg-white dark:border-navy-600 dark:bg-navy-900">
          <MdSearch className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDropdownOpen(true);
              if (!e.target.value) setSelected(null);
            }}
            onFocus={() => query && setDropdownOpen(true)}
            placeholder="Search by name, ID, or batch…"
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
          {query && (
            <button onClick={clear} className="shrink-0">
              <MdClose className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {dropdownOpen && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-800">
            {filtered.slice(0, 8).map((s) => (
              <button
                key={s._id || s.studentId}
                onClick={() => selectStudent(s)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-navy-700 first:rounded-t-lg last:rounded-b-lg"
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${s.image}`}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.visibility = "hidden";
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.studentId} · {s.batch}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {!selected && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-14 dark:border-navy-700">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            <IoSchool className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-gray-400">
            Search for a student to view performance
          </p>
        </div>
      )}

      {selected && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${selected.image}`}
                alt={selected.firstName}
                className="h-24 w-24 rounded-xl object-cover shadow-sm ring-2 ring-blue-200"
                onError={(e) => {
                  e.target.style.visibility = "hidden";
                }}
              />
              <p className="text-center text-sm font-bold text-gray-800 dark:text-white">
                {selected.firstName} {selected.lastName}
              </p>
              <p className="text-xs text-gray-400">{selected.studentId}</p>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {selected.batch}
              </span>
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {statItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex min-w-[130px] flex-1 flex-col gap-1 rounded-lg ${item.bg} px-3 py-2.5`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.icon}
                    <p className="text-[11px] font-medium text-gray-500">{item.label}</p>
                  </div>
                  <p className="text-base font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : chartData.length > 0 ? (
            <>
              <div>
                <h5 className="mb-3 text-sm font-bold text-gray-800 dark:text-white">
                  Performance Over Time
                </h5>
                <div className="h-[230px] w-full">
                  <LineChart
                    options={lineOptions}
                    series={[{ name: "Score %", data: chartData.map((d) => d.pct) }]}
                  />
                </div>
              </div>
              <div>
                <h5 className="mb-3 text-sm font-bold text-gray-800 dark:text-white">
                  Test History
                </h5>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-navy-700">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-navy-800">
                        {["Test", "Marks", "Score", "Status"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...chartData].reverse().map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-100 hover:bg-gray-50/50 dark:border-navy-700"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {row.marks}/{row.total}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full ${row.pct >= 35 ? "bg-blue-600" : "bg-red-500"}`}
                                  style={{ width: `${row.pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-700 dark:text-white">
                                {row.pct}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                                row.passed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {row.passed ? "Passed" : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10">
              <p className="text-sm text-gray-400">No test attempts found for this student.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default StudentFocus;