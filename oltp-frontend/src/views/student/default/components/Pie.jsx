import React, { useState, useEffect } from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";

const Pie = ({ tests = [], attemptedScores = [] }) => {
  // Count attempts per subject
  const subjectCounts = {};

  attemptedScores.forEach((score) => {
    const testInfo = tests.find((t) => t.testId === score.testId);
    if (testInfo && testInfo.subjects) {
      const subject = testInfo.subjects.split(",")[0].trim();
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    } else if (testInfo) {
      subjectCounts["General"] = (subjectCounts["General"] || 0) + 1;
    }
  });

  const labels = Object.keys(subjectCounts);
  const series = Object.values(subjectCounts);

  const chartOptions = {
    labels: labels,
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB", "#808080", "#FFD700"],
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: { show: false }
        }
      }
    }
  };

  return (
    <Card extra="rounded-[20px] p-4 h-full min-h-[350px] flex flex-col items-center justify-center">
      <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4 self-start">
        Subject Distribution
      </h4>
      <div className="flex-grow flex items-center justify-center w-full">
        {series.length > 0 ? (
          <div className="w-full h-[220px]">
            <PieChart options={chartOptions} series={series} />
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No data yet</p>
        )}
      </div>
      {series.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {labels.map((label, index) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: chartOptions.colors[index % chartOptions.colors.length] }}
              />
              <p className="text-xs font-bold text-gray-600 dark:text-white uppercase">{label}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Pie;
