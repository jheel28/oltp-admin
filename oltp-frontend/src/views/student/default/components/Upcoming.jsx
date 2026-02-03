import React, { useState, useEffect, useContext } from "react";
import Widget from "components/widget/Widget"; // Assuming Widget component is defined in Widget.js
import { IoMdAlarm } from "react-icons/io";
import { AuthContext } from "components/Auth-context";

const Upcoming = ({ unattemptedTests }) => {
  const [upcomingTestsCount, setUpcomingTestsCount] = useState(0); // Default to 0 upcoming tests

  return (
    <Widget
      icon={<IoMdAlarm className="h-6 w-6" />}
      title="Upcoming Tests"
      subtitle={unattemptedTests.length}
    />
  );
};

export default Upcoming;
