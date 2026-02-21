import React, { useEffect, useState, useMemo } from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { MdSearch, MdClose, MdPerson, MdBarChart, MdCheckCircle, MdCancel } from "react-icons/md";
import { IoSchool } from "react-icons/io5";

const StudentFocus = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentScores, setStudentScores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    const fetchBase = async () => {
      try {
        const [studRes, testRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`),
        ]);
        const studData = await studRes.json();
        const testData = await testRes.json();
        setAllStudents(studData.students || []);
        setAllTests(testData.tests || []);
      } catch (err) {
        console.error("StudentFocus fetch error:", err);
      }
    };
    fetchBase();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        s.batch?.toLowerCase().includes(q)
    );
  }, [searchQuery, allStudents]);

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setSearchQuery(`${student.firstName} ${student.lastName}`);
    setDropdownOpen(false);
    setLoadingScores(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/scores/bystudentid/${student.studentId}`
      );
      const data = await res.json();
      setStudentScores(data.scores || []);
    } catch (err) {
      setStudentScores([]);
    } finally {
      setLoadingScores(false);
    }
  };

  const clearSelection = () => {
    setSelectedStudent(null);
    setStudentScores([]);
    setSearchQuery("");
    setDropdownOpen(false);
  };

  const chartData = useMemo(() => {
    if (!selectedStudent || studentScores.length === 0) return [];
    return studentScores
      .map((score) => {
        const test = allTests.find((t) => t.testId === score.testId);
        return {
          label: test?.testName || score.testId,
          pct: Math.round((score.marksObtained / (score.totalMarks || 1)) * 100),
          marks: score.marksObtained,
          total: score.totalMarks,
          passed: score.passed,
          date: new Date(score.createdAt),
        };
      })
      .sort((a, b) => a.date - b.date);
  }, [studentScores, allTests]);

  const avgScore =
    chartData.length > 0
      ? Math.round(chartData.reduce((s, d) => s + d.pct, 0) / chartData.length)
      : 0;

  const passCount = chartData.filter((d) => d.passed).length;

  const lineOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#4318FF"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: chartData.map((d) => d.label),
      labels: { style: { colors: "#A3AED0", fontSize: "11px" }, rotate: -25 },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: { style: { colors: "#A3AED0", fontSize: "11px" } },
    },
    tooltip: { theme: "dark" },
    grid: { show: false },
    markers: { size: 5, colors: ["#4318FF"], strokeWidth: 0 },
    annotations: {
      yaxis: [
        {
          y: 35,
          borderColor: "#f87171",
          label: { text: "Pass Line", style: { color: "#f87171", background: "transparent" } },
        },
      ],
    },
  };

  const lineSeries = [{ name: "Score %", data: chartData.map((d) => d.pct) }];

  return (
    <Card extra="p-5 w-full">
      <div className="mb-5 flex items-center gap-2">
        <MdPerson className="h-6 w-6 text-brand-500" />
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Individual Student Focus
        </h4>
      </div>

      <div className="relative mb-6 w-full md:w-[400px]">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-lightPrimary px-3 py-2 dark:border-navy-600 dark:bg-navy-900">
          <MdSearch className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDropdownOpen(true);
              if (!e.target.value) setSelectedStudent(null);
            }}
            onFocus={() => searchQuery && setDropdownOpen(true)}
            placeholder="Search by name, ID, or batch..."
            className="w-full bg-transparent text-sm text-navy-700 outline-none placeholder:text-gray-400 dark:text-white"
          />
          {searchQuery && (
            <button onClick={clearSelection}>
              <MdClose className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {dropdownOpen && filteredStudents.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-800">
            {filteredStudents.slice(0, 8).map((s) => (
              <button
                key={s._id}
                onClick={() => selectStudent(s)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-navy-700 first:rounded-t-xl last:rounded-b-xl"
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${s.image}`}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-navy-700 dark:text-white">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {s.studentId} · {s.batch}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {!selectedStudent && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 rounded-full bg-brand-50 p-4 dark:bg-navy-900">
            <IoSchool className="h-10 w-10 text-brand-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Search for a student to view their performance details
          </p>
        </div>
      )}

      {selectedStudent && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-5 md:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${selectedStudent.image}`}
                alt={`${selectedStudent.firstName}`}
                className="h-24 w-24 rounded-2xl object-cover shadow-md"
              />
              <div className="text-center">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedStudent.studentId}
                </p>
                <span className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-0.5 text-xs font-semibold text-brand-500 dark:bg-navy-900">
                  {selectedStudent.batch}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap gap-3">
              {[
                {
                  label: "Tests Attempted",
                  value: chartData.length,
                  icon: <MdBarChart className="h-5 w-5 text-brand-500" />,
                  bg: "bg-brand-50 dark:bg-navy-900",
                },
                {
                  label: "Avg. Score",
                  value: `${avgScore}%`,
                  icon: <MdBarChart className="h-5 w-5 text-green-500" />,
                  bg: "bg-green-50 dark:bg-navy-900",
                },
                {
                  label: "Tests Passed",
                  value: `${passCount} / ${chartData.length}`,
                  icon: <MdCheckCircle className="h-5 w-5 text-teal-500" />,
                  bg: "bg-teal-50 dark:bg-navy-900",
                },
                {
                  label: "Tests Failed",
                  value: chartData.length - passCount,
                  icon: <MdCancel className="h-5 w-5 text-red-400" />,
                  bg: "bg-red-50 dark:bg-navy-900",
                },
                {
                  label: "Admission Date",
                  value: selectedStudent.admissionDate || "—",
                  icon: <IoSchool className="h-5 w-5 text-purple-400" />,
                  bg: "bg-purple-50 dark:bg-navy-900",
                },
                {
                  label: "Mobile",
                  value: selectedStudent.phoneNumber || "—",
                  icon: <MdPerson className="h-5 w-5 text-orange-400" />,
                  bg: "bg-orange-50 dark:bg-navy-900",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex min-w-[140px] flex-1 flex-col gap-1 rounded-2xl ${item.bg} px-4 py-3`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.icon}
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-navy-700 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {loadingScores ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : chartData.length > 0 ? (
            <>
              <div>
                <h5 className="mb-3 text-sm font-bold text-navy-700 dark:text-white">
                  Performance Over Time
                </h5>
                <div className="h-[260px] w-full">
                  <LineChart options={lineOptions} series={lineSeries} />
                </div>
              </div>

              <div>
                <h5 className="mb-3 text-sm font-bold text-navy-700 dark:text-white">
                  Test History
                </h5>
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-navy-700">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-navy-800">
                        {["Test", "Marks", "Percentage", "Status"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
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
                          className="border-t border-gray-100 dark:border-navy-700"
                        >
                          <td className="px-4 py-3 font-medium text-navy-700 dark:text-white">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {row.marks} / {row.total}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700">
                                <div
                                  className="h-full rounded-full bg-brand-500"
                                  style={{ width: `${row.pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-navy-700 dark:text-white">
                                {row.pct}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                row.passed
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
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
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                This student has not attempted any tests yet.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default StudentFocus;