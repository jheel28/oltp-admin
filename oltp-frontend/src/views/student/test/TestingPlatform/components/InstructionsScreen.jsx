import React, { useState } from "react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { STATUS } from "../hooks/useExamState";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const InstructionsScreen = ({ test, student, onBegin }) => {
  const [agreed, setAgreed] = useState(false);

  const fields = [
    ["Candidate Name", `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "—"],
    ["Roll Number", student?.studentId || "—"],
    ["Batch", student?.batch || "—"],
    ["Test Name", test?.testName || "—"],
    ["Duration", test?.duration ? `${test.duration} min` : "—"],
    ["Total Marks", test?.totalMarks ?? "—"],
  ];

  const instructions = [
    "The countdown timer in the header shows remaining time. When it reaches zero the exam auto-submits.",
    "Clicking an option only creates a draft selection (shown with a blue highlight). It is NOT saved yet.",
    "You MUST click Save & Next to record your answer. Unsaved drafts are lost on navigation.",
    "Use the Clear button to remove a draft before saving.",
    "The Question Palette on the right shows the status of every question.",
    "Tab switching is monitored. Three violations will automatically submit your exam.",
    "Do NOT refresh or close the browser. Saved answers are recovered if you reconnect.",
    "NAT questions require you to type a numerical value; non-numerical entries will not be accepted.",
    "MSQ questions allow multiple selections — all correct options must be chosen for full marks.",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-navy-900">
      <div className="flex items-center justify-between bg-[#1a2744] px-6 py-3 text-white shadow">
        <div>
          <div className="text-lg font-black tracking-tight">Online Examination Portal</div>
          <div className="text-xs text-blue-300">{test?.testName}</div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-4 px-4 py-6">
        {/* Student info card */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow">
          {student?.image && (
            <img
              src={`${BACKEND}/${student.image}`}
              alt="student"
              className="h-16 w-16 rounded-xl border-2 border-blue-100 object-cover"
            />
          )}
          <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {fields.map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="font-bold text-navy-700 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-base font-black text-navy-700">
            <MdOutlineVerifiedUser className="text-blue-600" /> General Instructions
          </h2>
          <div className="space-y-2 text-sm leading-relaxed text-gray-700">
            {instructions.map((text, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
                  {i + 1}
                </span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow">
          <h2 className="mb-3 text-sm font-black text-navy-700">Question Status Legend</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(STATUS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-black ${v.bg}`}>{k}</div>
                <span className="text-xs text-gray-600">{v.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-100 text-[11px] font-black text-blue-700">D</div>
              <span className="text-xs text-gray-600">Unsaved Draft</span>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded"
            />
            <span className="text-sm text-gray-700">
              I have read all instructions carefully and agree to abide by them during the examination.
            </span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            disabled={!agreed}
            onClick={onBegin}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            I am ready to begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsScreen;