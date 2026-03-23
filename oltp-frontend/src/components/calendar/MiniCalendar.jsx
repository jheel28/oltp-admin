import React, { useState } from "react";
import Calendar from "react-calendar";
import Card from "components/card";
import "react-calendar/dist/Calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "assets/css/MiniCalendar.css";

const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split(/[-/]/).map(Number);
  let year, month, day;
  if (parts[0] > 1000) [year, month, day] = parts;
  else if (parts[2] > 1000) [day, month, year] = parts;
  else [year, month, day] = parts;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const MiniCalendar = ({ value, onChange, exams }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, tests: [], dateStr: "" });

  const getExamsForDate = (date) => {
    if (!exams) return [];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const calendarDateStr = `${year}-${month}-${day}`;
    return exams.filter((exam) => normalizeDate(exam.date) === calendarDateStr);
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dayExams = getExamsForDate(date);
    if (dayExams.length === 0) return null;

    return (
      <div className="flex justify-center mt-0.5">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-700 dark:bg-white" />
      </div>
    );
  };

  const handleTileMouseEnter = (date, event) => {
    const dayExams = getExamsForDate(date);
    if (dayExams.length === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest(".calendar-wrapper")?.getBoundingClientRect();
    const x = containerRect ? rect.left - containerRect.left + rect.width / 2 : rect.left;
    const y = containerRect ? rect.top - containerRect.top : rect.top;

    const d = date;
    const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    setTooltip({ visible: true, x, y, tests: dayExams, dateStr });
  };

  const handleTileMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const tileProps = ({ date, view }) => {
    if (view !== "month") return {};
    return {
      onMouseEnter: (e) => handleTileMouseEnter(date, e),
      onMouseLeave: handleTileMouseLeave,
    };
  };

  return (
    <Card extra="flex w-full h-full flex-col px-3 py-3">
      <div className="calendar-wrapper relative">
        <Calendar
          onChange={onChange}
          value={value}
          prevLabel={<MdChevronLeft className="ml-1 h-6 w-6" />}
          nextLabel={<MdChevronRight className="ml-1 h-6 w-6" />}
          view="month"
          tileContent={tileContent}
          tileProps={tileProps}
        />

        {tooltip.visible && tooltip.tests.length > 0 && (
          <div
            className="pointer-events-none absolute z-50 w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-navy-600 dark:bg-navy-800"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 8}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="mb-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              {tooltip.dateStr}
            </p>
            <div className="flex flex-col gap-1">
              {tooltip.tests.map((test, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700 dark:bg-teal-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">
                      {test.testName || test.testId}
                    </p>
                    {(test.startTime || test.batchName) && (
                      <p className="text-[10px] text-gray-400">
                        {test.startTime && `${test.startTime}`}
                        {test.startTime && test.batchName && " · "}
                        {test.batchName && test.batchName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MiniCalendar;