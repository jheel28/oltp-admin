import React from "react";
import Widget from "components/widget/Widget";
import { MdBarChart } from "react-icons/md";

const Ranking = ({ tests }) => {
  const attemptedTests = Array.isArray(tests) ? tests.filter(t => t.marksObtained !== undefined && t.totalMarks !== undefined) : [];

  const totalPercentage = attemptedTests.reduce((acc, t) => {
    const percentage = (parseFloat(t.marksObtained) / parseFloat(t.totalMarks)) * 100;
    return acc + percentage;
  }, 0);

  const avgScore = attemptedTests.length > 0
    ? Math.round(totalPercentage / attemptedTests.length)
    : 0;

  return (
    <Widget
      icon={<MdBarChart className="h-7 w-7" />}
      title="Avg. Score"
      subtitle={avgScore + "%"}
    />
  );
};

export default Ranking;