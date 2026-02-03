import React, { useState, useEffect } from "react";
import Widget from "components/widget/Widget"; // Assuming Widget component is defined in Widget.js
import { IoDocuments } from "react-icons/io5";

const PapersSolved = ({ attemptedTests }) => {
  const [papersSolved, setPapersSolved] = useState(0); // Default to 0 papers solved

  useEffect(() => {
    // Simulate fetching papers solved from backend (replace with actual backend call)
    const fetchPapersSolved = async () => {
      try {
        // Make API call to fetch the number of papers solved
        // const response = await fetch("/api/papersSolved");
        // const data = await response.json();
        // setPapersSolved(data.papersSolved);
        // For now, let's just set a default value of 0 for demonstration
        setPapersSolved(0);
      } catch (error) {
        console.error("Error fetching papers solved:", error);
      }
    };

    fetchPapersSolved();
  }, []);

  return (
    <Widget
      icon={<IoDocuments className="h-6 w-6" />}
      title="Papers Solved"
      subtitle={attemptedTests}
    />
  );
};

export default PapersSolved;
