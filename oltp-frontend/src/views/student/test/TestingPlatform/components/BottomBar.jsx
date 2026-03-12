import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineCalculator } from "react-icons/ai";
import { MdOutlineBookmarkAdd, MdBookmark } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";

const BottomBar = ({
  currentIdx,
  totalQuestions,
  allowCalculator,
  isMarked,
  onPrev,
  onSaveNext,
  onMarkSaveNext,
  onClear,
  onToggleCalc,
}) => {
  return (
    <div className="hidden lg:flex flex-none flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition"
        >
          <AiOutlineArrowLeft /> Prev
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition"
        >
          <MdClear className="h-4 w-4" /> Clear
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

      <div className="flex items-center gap-2">
        <button
          onClick={onMarkSaveNext}
          title={isMarked ? "Unmark and save" : "Mark for review and save"}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition shadow-sm ${
            isMarked
              ? "bg-purple-500 text-white hover:bg-purple-600 shadow-purple-200"
              : "bg-amber-400 text-amber-950 hover:bg-amber-500"
          }`}
        >
          {isMarked ? (
            <MdBookmark className="h-4 w-4" />
          ) : (
            <MdOutlineBookmarkAdd className="h-4 w-4" />
          )}
          {isMarked ? "Marked" : "Mark & Save"}
        </button>

        <button
          onClick={onSaveNext}
          className="flex items-center gap-1.5 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200 hover:bg-green-600 transition"
        >
          <IoCheckmarkCircleOutline className="h-4 w-4" />
          Save & Next
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export const MobileBar = ({
  allowCalculator,
  onToggleCalc,
  onEndTest,
  onPrev,
  onSaveNext,
  onMarkSaveNext,
  onClear,
  isMarked,
  currentIdx,
  totalQuestions,
}) => (
  <div
    className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white px-3 py-2 lg:hidden"
    style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
  >
    {/* Top row: small controls */}
    <div className="mb-2 flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={currentIdx === 0}
        className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold text-gray-600 disabled:opacity-40"
        title="Previous"
      >
        <AiOutlineArrowLeft /> Prev
      </button>

      <button
        onClick={onClear}
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-500"
        title="Clear"
      >
        <MdClear /> Clear
      </button>

      {allowCalculator && (
        <button
          onClick={onToggleCalc}
          className="rounded-xl border border-gray-200 px-3 py-2 text-gray-500"
          title="Calculator"
        >
          <AiOutlineCalculator />
        </button>
      )}

      <button
        onClick={onMarkSaveNext}
        className={`ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
          isMarked ? 'bg-purple-500 text-white' : 'bg-amber-400 text-amber-950'
        }`}
        title="Mark & Save"
      >
        {isMarked ? <MdBookmark /> : <MdOutlineBookmarkAdd />} 
        <span className="whitespace-nowrap text-xs">{isMarked ? 'Marked' : 'Mark & Save'}</span>
      </button>
    </div>

    {/* Bottom row: primary actions */}
    <div className="flex items-center gap-2">
      <button
        onClick={onSaveNext}
        className="flex-1 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white"
        title="Save & Next"
      >
        Save & Next
      </button>

      <button
        onClick={onEndTest}
        className="ml-2 rounded-xl bg-[#1a2744] px-4 py-3 text-sm font-black text-white"
        title="End Test"
      >
        End Test
      </button>
    </div>
  </div>
);

export default BottomBar;