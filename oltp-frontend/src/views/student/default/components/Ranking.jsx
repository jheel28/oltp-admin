import React, { useState, useEffect } from "react";
import Widget from "components/widget/Widget"; // Assuming Widget component is defined in Widget.js
import { MdBarChart } from "react-icons/md";

const Ranking = () => {
  const [rank, setRank] = useState(null);

  useEffect(() => {
    // Simulate fetching rank from backend (replace with actual backend call)
    const fetchRank = async () => {
      try {
        // Make API call to fetch the rank
        // const response = await fetch("/api/rank");
        // const data = await response.json();
        // setRank(data.rank);
        // For now, let's just set a random rank for demonstration
        const randomRank = Math.floor(Math.random() * 100) + 1; // Random rank between 1 and 100
        setRank(randomRank);
      } catch (error) {
        console.error("Error fetching rank:", error);
      }
    };

    fetchRank();
  }, []);

  return (
    <Widget
      icon={<MdBarChart className="h-7 w-7" />}
      title="Class Ranking"
      subtitle={rank !== null ? rank.toString() : "Loading..."}
    />
  );
};

export default Ranking;
