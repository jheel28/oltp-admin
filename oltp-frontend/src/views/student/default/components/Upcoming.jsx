import Widget from "components/widget/Widget";
import { IoMdAlarm } from "react-icons/io";

const Upcoming = ({ unattemptedTests }) => {
  return (
    <Widget
      icon={<IoMdAlarm className="h-6 w-6" />}
      title="Upcoming Tests"
      subtitle={unattemptedTests.length}
    />
  );
};

export default Upcoming;
