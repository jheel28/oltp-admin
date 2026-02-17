import React from "react";
import Widget from "components/widget/Widget";
import { MdBarChart } from "react-icons/md";

const Ranking = ({ tests }) => {
  // Replace random rank with Average Score percentage
  const attemptedTests = tests.filter(t => t.score !== undefined);
  const avgScore = attemptedTests.length > 0
    ? Math.round(attemptedTests.reduce((acc, t) => acc + (t.score || 0), 0) / attemptedTests.length)
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
