import React from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { MdBarChart } from "react-icons/md";

const StudentPerformance = ({ tests = [], attemptedScores = [] }) => {
  const chartData = attemptedScores
    .map((score) => {
      const testInfo = tests.find((t) => t.testId === score.testId);
      const pct = Math.round(
        (parseFloat(score.marksObtained) / (parseFloat(score.totalMarks) || 100)) * 100
      );
      const dateVal = score.createdAt
        ? new Date(score.createdAt)
        : testInfo?.date
        ? new Date(testInfo.date)
        : new Date(0);
      return {
        date: dateVal,
        testName: score.testName || testInfo?.testName || score.testId || "Test",
        score: pct,
        passed: score.passed,
      };
    })
    .filter((d) => !isNaN(d.score))
    .sort((a, b) => a.date - b.date);

  const avg = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length)
    : 0;
  const best = chartData.length > 0 ? Math.max(...chartData.map((d) => d.score)) : 0;

  const chartOptions = {
    chart: { type: "line", zoom: { enabled: false }, toolbar: { show: false } },
    colors: ["#1D4ED8"],
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: chartData.map((d) => d.testName),
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
    markers: { size: 4, colors: ["#1D4ED8"], strokeColors: "#fff", strokeWidth: 2 },
  };

  return (
    <Card extra="!p-5 h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
            <MdBarChart className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-white">Performance History</h4>
        </div>
        {chartData.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-medium text-gray-400">Avg</p>
              <p className="text-sm font-bold text-gray-700 dark:text-white">{avg}%</p>
            </div>
            <div className="h-7 w-px bg-gray-200" />
            <div className="text-right">
              <p className="text-[10px] font-medium text-gray-400">Best</p>
              <p className="text-sm font-bold text-green-600">{best}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="h-[280px] w-full">
        {chartData.length > 0 ? (
          <LineChart
            options={chartOptions}
            series={[{ name: "Score %", data: chartData.map((d) => d.score) }]}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:bg-cyan-700">
            <MdBarChart className="mb-2 h-10 w-10 text-gray-200" />
            <p className="text-sm font-medium text-gray-400">
              Attempt a test to see performance history
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudentPerformance;