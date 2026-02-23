import React, { useEffect, useState } from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { MdGroups } from "react-icons/md";

const COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#64748B", "#94A3B8", "#1D4ED8", "#0EA5E9"];

const PieChartCard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/all/students`
        );
        if (!res.ok) return;
        const data = await res.json();
        setStudents(data.students || []);
      } catch (_) {}
    };
    fetch_();
  }, []);

  const batchCounts = {};
  students.forEach(({ batch }) => {
    if (batch) batchCounts[batch] = (batchCounts[batch] || 0) + 1;
  });
  const labels = Object.keys(batchCounts);
  const seriesData = Object.values(batchCounts);

  const pieOptions = {
    labels,
    colors: COLORS,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    chart: { type: "donut" },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Students",
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748B",
              formatter: () => students.length,
            },
          },
        },
      },
    },
  };

  return (
    <Card extra="rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <MdGroups className="h-5 w-5 text-blue-600" />
        <h4 className="text-sm font-bold text-gray-800 dark:text-white">Students by Batch</h4>
      </div>

      <div className="flex h-[170px] w-full items-center justify-center">
        {seriesData.length > 0 ? (
          <PieChart options={pieOptions} series={seriesData} />
        ) : (
          <p className="text-sm text-gray-400">No data</p>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {labels.map((batch, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <p className="max-w-[130px] truncate text-xs font-medium text-gray-600 dark:text-gray-400">
                {batch}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-14 overflow-hidden rounded-full bg-gray-100 dark:bg-navy-700">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${students.length > 0 ? (batchCounts[batch] / students.length) * 100 : 0}%`,
                    backgroundColor: COLORS[i % COLORS.length],
                  }}
                />
              </div>
              <span className="w-4 text-right text-xs font-semibold text-gray-700 dark:text-white">
                {batchCounts[batch]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PieChartCard;