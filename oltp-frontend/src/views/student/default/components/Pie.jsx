import React, { useState, useEffect } from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";

const Pie = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching pie chart data from backend (replace with actual backend call)
    const fetchPieChartData = async () => {
      try {
        // Make API call to fetch pie chart data
        // const response = await fetch("/api/pieChartData");
        // const data = await response.json();
        // setPieChartData(data);
        // setLoading(false);
        // For now, let's just set a dummy data for demonstration
        const dummyData = [
          { name: "Mathematics", value: 30 },
          { name: "Science", value: 20 },
          { name: "English", value: 15 },
          { name: "History", value: 10 },
          { name: "Geography", value: 25 },
        ];
        setPieChartData(dummyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, []);

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Papers Solved
          </h4>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="mb-auto flex h-[300px] w-[400px] items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <PieChart
            options={{
              chart: {
                width: "100%",
                height: "100%",
                toolbar: {
                  show: false,
                },
              },
              legend: {
                show: false,
              },
              dataLabels: {
                enabled: false,
              },
              tooltip: {
                custom: function ({ seriesIndex, dataPointIndex, w }) {
                  return `<div>${w.config.series[seriesIndex][dataPointIndex]}</div>`; // Adjust this to return the subject name
                },
              },
            }}
            series={pieChartData.map((dataPoint) => dataPoint.value)}
          />
        )}
      </div>
    </Card>
  );
};

export default Pie;
