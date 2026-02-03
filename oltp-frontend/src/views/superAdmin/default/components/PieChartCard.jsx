import React, { useEffect, useState } from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";
import { message } from "antd";

const PieChartCard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status ${response.status}`);
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        message.error("Error fetching students:", err.message);
      }
    };
    fetchStudents();
  }, []);
  // Create an object to store the count of students in each batch
  const batchCounts = {};

  // Iterate through the students array to count the students in each batch
  students.forEach((student) => {
    const { batch } = student;

    if (batchCounts[batch]) {
      batchCounts[batch]++;
    } else {
      batchCounts[batch] = 1;
    }
  });

  // Extract batch names and counts for the pie chart options
  const labels = Object.keys(batchCounts);
  const seriesData = Object.values(batchCounts);

  // Pie chart options with batch names as labels
  const pieChartOptions = {
    labels: labels,
    // Add other options as needed
  };

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Students by Batch
          </h4>
        </div>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={seriesData} />
      </div>

      <div className="flex flex-col justify-center gap-2 px-3 py-2">
        {/* Render batch names and student counts */}
        {labels.map((batch, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-brand-500" />
              <p className="text-sm font-normal text-gray-600">{batch}</p>
            </div>
            <p className="text-sm font-normal text-gray-600">
              {batchCounts[batch]}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PieChartCard;
