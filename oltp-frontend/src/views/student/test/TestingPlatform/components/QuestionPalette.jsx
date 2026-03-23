import React from "react";
import { MdLock } from "react-icons/md";
import { STATUS } from "../hooks/useExamState";

const BACKEND = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

const imgSrc = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const QuestionPalette = ({
  student, sections, statuses, currentIdx, hasDraft,
  activeSection, onGoTo, onSetSection, onEndTest,
  stats,
}) => {
  const studentImg = imgSrc(student?.image);

  return (
    <div className="hidden w-72 flex-shrink-0 flex-col overflow-hidden border-l border-gray-200 bg-white lg:flex xl:w-80">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
        {studentImg && (
          <img
            src={studentImg}
            alt=""
            className="h-10 w-10 flex-shrink-0 rounded-xl border-2 border-teal-100 object-cover"
            draggable={false}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-navy-700">
            {student?.firstName} {student?.lastName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {student?.studentId}
          </p>
        </div>
        <MdLock className="ml-auto flex-shrink-0 text-green-500" />
      </div>

      <div className="grid grid-cols-3 border-b border-gray-100">
        {[
          { v: stats.answered, l: "Saved", c: "text-green-600 bg-green-50" },
          { v: (statuses.length - stats.answered), l: "Pending", c: "text-red-500 bg-red-50" },
          { v: stats.marked, l: "Marked", c: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.l} className={`py-3 text-center ${s.c}`}>
            <p className={`text-xl font-black ${s.c.split(" ")[0]}`}>{s.v}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {sections.map((sec, si) => (
          <div key={si} className={si > 0 ? "mt-4" : ""}>
            {sections.length > 1 && (
              <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                {sec.name}
              </p>
            )}
            <div className="grid grid-cols-7 gap-1.5">
              {sec.indices.map((qIdx) => {
                const cfg = STATUS[statuses[qIdx]] || STATUS[0];
                const isDraftHere = qIdx === currentIdx && hasDraft;
                return (
                  <button
                    key={qIdx}
                    onClick={() => {
                      onGoTo(qIdx);
                      if (si !== activeSection) onSetSection(si);
                    }}
                    className={`relative h-8 w-8 rounded-lg border text-[11px] font-black transition-all ${cfg.bg} ${
                      currentIdx === qIdx
                        ? "scale-110 shadow-md ring-2 ring-blue-500 ring-offset-1"
                        : "hover:scale-105"
                    }`}
                  >
                    {qIdx + 1}
                    {isDraftHere && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-orange-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
          <span>Not visited: {stats.notVisited}</span>
          <span>{stats.answered}/{statuses.length} saved</span>
        </div>
        <button
          onClick={onEndTest}
          className="w-full rounded-xl bg-cyan-900 py-3 font-black text-white shadow transition-all hover:bg-navy-800"
        >
          End Test
        </button>
      </div>
    </div>
  );
};

export default QuestionPalette;