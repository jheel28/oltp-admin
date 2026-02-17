import React from "react";
import Widget from "components/widget/Widget";
import { IoDocuments } from "react-icons/io5";

const PapersSolved = ({ attemptedTests }) => {
  return (
    <Widget
      icon={<IoDocuments className="h-6 w-6" />}
      title="Papers Solved"
      subtitle={attemptedTests}
    />
  );
};

export default PapersSolved;
