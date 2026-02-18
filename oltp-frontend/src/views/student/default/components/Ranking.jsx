import React from "react";
import Widget from "components/widget/Widget";
import { MdBarChart } from "react-icons/md";

const Ranking = ({ tests }) => {
  // Calculate Average Score percentage from attempted tests
  const attemptedTests = Array.isArray(tests) ? tests.filter(t => t.marks !== undefined && t.maxscore !== undefined) : [];

  const totalPercentage = attemptedTests.reduce((acc, t) => {
    const percentage = (parseFloat(t.marks) / parseFloat(t.maxscore)) * 100;
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
