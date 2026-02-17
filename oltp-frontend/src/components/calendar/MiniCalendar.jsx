import React from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";

const MiniCalendar = (props) => {
  const { value, onChange, exams } = props;

  // Function to add a dot if there are exams on that day
  const tileContent = ({ date, view }) => {
    if (view === 'month' && exams) {
      // Use local date parts to avoid UTC shifting
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const hasExams = exams.some(exam => exam.date === dateStr);

      if (hasExams) {
        return (
          <div className="flex justify-center items-center mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card extra="flex w-full h-full flex-col px-3 py-3">
      <Calendar
        onChange={onChange}
        value={value}
        prevLabel={<MdChevronLeft className="ml-1 h-6 w-6 " />}
        nextLabel={<MdChevronRight className="ml-1 h-6 w-6 " />}
        view={"month"}
        tileContent={tileContent}
      />
    </Card>
  );
};

export default MiniCalendar;
