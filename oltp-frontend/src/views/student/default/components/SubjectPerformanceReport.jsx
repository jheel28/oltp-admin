import React from "react";
import Card from "components/card";
import BarChart from "components/charts/BarChart";

const SubjectPerformanceReport = ({ tests = [], attemptedScores = [] }) => {
    const subjectStats = {};

    attemptedScores.forEach((score) => {
        const testInfo = tests.find((t) => t.testId === score.testId);
        if (testInfo) {
            const subject = testInfo.subjects ? testInfo.subjects.split(",")[0].trim() : "General";
            const percentage = (score.marks / (score.maxscore || 100)) * 100;

            if (!subjectStats[subject]) {
                subjectStats[subject] = { totalPercentage: 0, count: 0 };
            }
            subjectStats[subject].totalPercentage += percentage;
            subjectStats[subject].count += 1;
        }
    });

    const categories = Object.keys(subjectStats);
    const data = categories.map((cat) => Math.round(subjectStats[cat].totalPercentage / subjectStats[cat].count));

    const chartData = [
        {
            name: "Avg Score %",
            data: data,
        },
    ];

    const chartOptions = {
        chart: {
            toolbar: { show: false },
        },
        tooltip: { theme: "dark" },
        xaxis: {
            categories: categories,
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
        grid: { show: false },
        fill: {
            colors: ["#4318FF"],
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.8,
                opacityTo: 0.8,
                stops: [0, 100]
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "50%",
            },
        },
    };

    return (
        <Card extra="flex flex-col bg-white w-full rounded-2xl p-4 h-full min-h-[350px]">
            <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                Subject Performance
            </h4>
            <div className="flex-grow flex items-center justify-center">
                {data.length > 0 ? (
                    <div className="w-full h-[250px]">
                        <BarChart chartData={chartData} chartOptions={chartOptions} />
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Attempt tests to see subject analysis</p>
                )}
            </div>
        </Card>
    );
};

export default SubjectPerformanceReport;
