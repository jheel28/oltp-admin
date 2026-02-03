import React, { useState, useEffect } from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
// Import Axios for making HTTP requests

const StudentPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch("/api/studentPerformance");
        setPerformanceData([
          {
            name: "Math",
            data: [50, 60, 55, 70, 65, 75, 80, 85, 90, 95, 100, 105],
          },
          {
            name: "Science",
            data: [55, 65, 60, 75, 70, 80, 85, 90, 95, 100, 105, 110],
          },
          {
            name: "English",
            data: [45, 55, 50, 65, 60, 70, 75, 80, 85, 90, 95, 100],
          },
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setIsLoading(false);
        // If API request fails, set performance data manually for testing
      }
    };

    fetchPerformanceData();
  }, []);

  // Chart options
  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "", // Set y-axis title to empty string
      },
    },
  };

  return (
    <Card extra="!p-[20px] text-left">
      <h4 className="text-xl font-bold text-navy-700 dark:text-white">
        Performance
      </h4>

      {isLoading ? (
        <p>Loading performance data...</p>
      ) : (
        <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
          <div className="flex flex-col"></div>
          <div className="h-full w-full">
            <LineChart options={chartOptions} series={performanceData} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default StudentPerformance;
