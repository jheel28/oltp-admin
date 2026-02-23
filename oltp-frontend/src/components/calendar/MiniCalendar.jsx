import React from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";

const MiniCalendar = (props) => {
  const { value, onChange, exams } = props;

  const tileContent = ({ date, view }) => {
    if (view === "month" && exams) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const calendarDateStr = `${year}-${month}-${day}`;

      const hasExams = exams.some((exam) => {
        if (!exam.date) return false;

        const parts = exam.date.split(/[-/]/).map(Number);
        let eYear, eMonth, eDay;

        if (parts[0] > 1000) [eYear, eMonth, eDay] = parts;
        else if (parts[2] > 1000) [eDay, eMonth, eYear] = parts;
        else [eYear, eMonth, eDay] = parts;

        const normalizedExamDate = `${eYear}-${String(eMonth).padStart(
          2,
          "0"
        )}-${String(eDay).padStart(2, "0")}`;

        return normalizedExamDate === calendarDateStr;
      });

      if (hasExams) {
        return (
          <div className="mt-1 flex items-center justify-center">
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
