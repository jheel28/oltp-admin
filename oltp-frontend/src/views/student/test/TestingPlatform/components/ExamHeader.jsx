import React from "react";
import { IoMdAlarm, IoMdWarning } from "react-icons/io";
import { MdSave } from "react-icons/md";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

const ExamHeader = ({
  testName, category, timeLeft, formatTime, isUrgent, isWarning,
  violations, isFullscreen, toggleFullscreen, lastSaved,
}) => {
  return (
    <div className="z-30 flex flex-none items-center justify-between bg-cyan-900 px-4 py-2.5 shadow-lg">
      <div className="min-w-0">
        <div className="truncate text-sm font-black text-white">{testName}</div>
        {category && <div className="text-[10px] text-teal-300">{category}</div>}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Violation badge */}
        {violations > 0 && (
          <div className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
            violations >= 2 ? "animate-pulse bg-red-500 text-white" : "bg-amber-400 text-amber-900"
          }`}>
            <IoMdWarning /> {violations}/3
          </div>
        )}

        {/* Last saved indicator */}
        {lastSaved && (
          <div className="hidden items-center gap-1 text-[10px] text-teal-300 sm:flex">
            <MdSave className="h-3 w-3" />
            <span>Saved {new Date(lastSaved).toLocaleTimeString()}</span>
          </div>
        )}

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
        </button>

        {/* Timer */}
        <div className={`flex min-w-[90px] items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-base font-black tabular-nums transition-colors ${
          isUrgent
            ? "animate-pulse bg-red-500 text-white"
            : isWarning
            ? "bg-amber-400 text-amber-900"
            : "bg-white/15 text-white"
        }`}>
          <IoMdAlarm className="h-4 w-4 flex-shrink-0" />
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;