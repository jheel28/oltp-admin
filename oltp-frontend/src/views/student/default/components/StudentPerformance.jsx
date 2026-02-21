import React from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";

const StudentPerformance = ({ tests = [], attemptedScores = [] }) => {
  const chartData = attemptedScores
    .map((score) => {
      const testInfo = tests.find((t) => t.testId === score.testId);
      if (!testInfo) return null;

      const percentage = Math.round((score.marksObtained / (score.totalMarks || 100)) * 100);
      return {
        date: new Date(testInfo.date),
        testName: testInfo.testName || `Test ${testInfo.testId}`,
        score: percentage,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);

  const series = [
    {
      name: "Score %",
      data: chartData.map((d) => d.score),
    },
  ];

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#4318FF"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: chartData.map((d) => d.testName),
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      show: false,
    },
  };

  return (
    <Card extra="!p-[20px] text-left">
      <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">
        Performance History
      </h4>

      <div className="h-[350px] w-full">
        {chartData.length > 0 ? (
          <LineChart options={chartOptions} series={series} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Attempt a test to see your performance history!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudentPerformance;