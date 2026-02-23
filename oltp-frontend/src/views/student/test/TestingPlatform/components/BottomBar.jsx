import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineCalculator } from "react-icons/ai";

const BottomBar = ({
  currentIdx, totalQuestions, allowCalculator,
  onPrev, onNext, onSaveNext, onMarkNext, onClear, onEndTest, onToggleCalc,
}) => {
  return (
    <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={currentIdx === 0}
        className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
      >
        <AiOutlineArrowLeft /> Previous
      </button>

      {/* Center actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition"
        >
          Clear
        </button>
        <button
          onClick={onMarkNext}
          className="rounded-xl border border-purple-300 px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 transition"
        >
          Mark & Next
        </button>
        {allowCalculator && (
          <button
            onClick={onToggleCalc}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 transition"
            title="Toggle calculator"
          >
            <AiOutlineCalculator className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Save & Next */}
      <button
        onClick={onSaveNext}
        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
      >
        Save & Next <AiOutlineArrowRight />
      </button>
    </div>
  );
};

export const MobileBar = ({ allowCalculator, onToggleCalc, onEndTest }) => (
  <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-2 lg:hidden">
    {allowCalculator && (
      <button onClick={onToggleCalc} className="rounded-lg border p-2 text-gray-500">
        <AiOutlineCalculator />
      </button>
    )}
    <button onClick={onEndTest} className="flex-1 rounded-xl bg-[#1a2744] py-2.5 text-sm font-black text-white">
      End Test
    </button>
  </div>
);

export default BottomBar;