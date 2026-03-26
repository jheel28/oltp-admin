import React from "react";
import { MdOutlineBookmarkAdd, MdOutlineBookmark } from "react-icons/md";

const BACKEND = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");

// Normalises any stored file path into a full absolute URL.
// Handles: null/undefined, already-absolute URLs, relative paths,
// Windows backslash paths (e.g. uploads\images\file.jpg).
const imgSrc = (p) => {
  if (p === null || p === undefined || p === "") return null;
  const n = String(p)
    .replace(/\\/g, "/")   // backslash → forward slash
    .replace(/^\/+/, "");  // strip leading slashes
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  const url = `${BACKEND}/${n}`;
  console.debug("[imgSrc] resolved:", url);
  return url;
};

const TYPE_LABELS = {
  MCQ: { label: "Single Correct", cls: "border-gray-200 bg-gray-50 text-gray-600" },
  MSQ: { label: "Multiple Correct", cls: "border-teal-100 bg-teal-50 text-teal-700" },
  NAT: { label: "Numerical", cls: "border-indigo-100 bg-indigo-50 text-indigo-700" },
};

const OptionItem = ({ opt, optIdx, isDrafted, isSaved, onSelect }) => {
  let cls = "border-gray-200 bg-white hover:border-teal-300 hover:bg-gray-50";
  let labelCls = "text-gray-700";
  let badgeCls = "";
  let badgeText = "";

  if (isSaved && isDrafted) {
    cls = "border-green-500 bg-green-50 shadow-sm";
    labelCls = "text-green-700";
    badgeCls = "bg-green-100 text-green-700";
    badgeText = "Saved";
  } else if (isDrafted) {
    cls = "border-teal-400 bg-teal-50 shadow-sm";
    labelCls = "text-teal-700";
    badgeCls = "bg-teal-100 text-teal-700";
    badgeText = "Draft";
  } else if (isSaved) {
    cls = "border-green-400 bg-green-50 shadow-sm";
    labelCls = "text-green-700";
    badgeCls = "bg-green-100 text-green-700";
    badgeText = "Saved";
  }

  const indicatorCls =
    isSaved && isDrafted
      ? "border-green-500 bg-green-500 text-white"
      : isDrafted
      ? "border-teal-400 bg-teal-400 text-white"
      : isSaved
      ? "border-green-400 bg-green-400 text-white"
      : "border-gray-300 bg-gray-50 text-gray-400 group-hover:border-teal-300";

  const src = imgSrc(opt.image);

  return (
    <div
      onClick={() => onSelect(optIdx)}
      className={`group flex cursor-pointer items-start gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-150 ${cls}`}
    >
      <div
        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 text-xs font-black transition-all ${indicatorCls}`}
      >
        {String.fromCharCode(65 + optIdx)}
      </div>
      <div className="min-w-0 flex-1">
        {opt.text && (
          <span className={`text-sm font-semibold leading-relaxed ${labelCls}`}>
            {opt.text}
          </span>
        )}
        {src && (
          <div className="mt-2">
            <img
              src={src}
              alt={`Option ${String.fromCharCode(65 + optIdx)}`}
              className="max-h-40 max-w-full rounded-lg border border-gray-100 object-contain bg-gray-50"
              draggable={false}
              onError={(e) => {
                console.warn("[QuestionDisplay] Option image failed:", src);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
      {badgeText && (
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeCls}`}>
          {badgeText}
        </span>
      )}
    </div>
  );
};

const QuestionDisplay = ({
  question,
  questionNumber,
  totalQuestions,
  currentDraft,
  savedAnswer,
  hasDraft,
  isMarked,
  onDraftSelect,
  onToggleMark,
}) => {
  if (!question) return null;

  const typeInfo = TYPE_LABELS[question.type] || TYPE_LABELS.MCQ;

  const savedArr = Array.isArray(savedAnswer)
    ? savedAnswer
    : savedAnswer !== null && savedAnswer !== undefined
    ? [savedAnswer]
    : [];

  const draftArr = Array.isArray(currentDraft)
    ? currentDraft
    : currentDraft !== null && currentDraft !== undefined
    ? [currentDraft]
    : [];

  const qImgSrc = imgSrc(question.questionImage);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-400">
            Q{questionNumber} / {totalQuestions}
          </span>
          {question.topic && (
            <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
              {question.topic}
            </span>
          )}
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${typeInfo.cls}`}>
            {typeInfo.label}
          </span>
          {question.type === "MSQ" && (
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-600">
              Select all that apply
            </span>
          )}
          {hasDraft && (
            <span className="animate-pulse rounded-full border border-orange-300 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
              Unsaved draft
            </span>
          )}
        </div>
        <button
          onClick={onToggleMark}
          className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
            isMarked
              ? "border-purple-500 bg-purple-500 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600"
          }`}
        >
          {isMarked ? <MdOutlineBookmark /> : <MdOutlineBookmarkAdd />}
          {isMarked ? "Marked" : "Mark"}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p
          className="mb-5 text-sm font-bold leading-relaxed text-gray-800"
          style={{ userSelect: "none", WebkitUserSelect: "none" }}
        >
          {question.text}
        </p>

        {qImgSrc && (
          <div className="mb-5 flex justify-center rounded-xl border border-gray-100 bg-gray-50 p-3">
            <img
              src={qImgSrc}
              alt="Question"
              className="max-h-72 max-w-full rounded-lg object-contain"
              draggable={false}
              onError={(e) => {
                console.warn("[QuestionDisplay] Question image failed:", qImgSrc);
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
          </div>
        )}

        {question.type === "NAT" && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Enter your numerical answer
            </p>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="Type your numerical answer here"
              value={
                currentDraft !== null && currentDraft !== undefined
                  ? currentDraft
                  : ""
              }
              onChange={(e) => onDraftSelect(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-xl font-black text-navy-700 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
            />
            {savedAnswer !== null && savedAnswer !== undefined && (
              <p className="text-xs text-gray-500">
                Currently saved:{" "}
                <strong className="text-green-600">{savedAnswer}</strong>
                {hasDraft &&
                  currentDraft !== null &&
                  currentDraft !== undefined &&
                  currentDraft !== savedAnswer && (
                    <span className="ml-2 text-orange-500">
                      (Draft: {currentDraft})
                    </span>
                  )}
              </p>
            )}
            <p className="text-[10px] text-gray-400">
              Click Save & Next to record this answer.
            </p>
          </div>
        )}

        {question.type !== "NAT" && (
          <div className="space-y-2.5">
            {(question.options || []).map((opt, optIdx) => {
              const isDrafted =
                question.type === "MSQ"
                  ? draftArr.map(Number).includes(optIdx)
                  : currentDraft !== null && currentDraft !== undefined && Number(currentDraft) === optIdx;

              const isSaved =
                question.type === "MSQ"
                  ? savedArr.map(Number).includes(optIdx)
                  : savedAnswer !== null && savedAnswer !== undefined && Number(savedAnswer) === optIdx;

              return (
                <OptionItem
                  key={optIdx}
                  opt={opt}
                  optIdx={optIdx}
                  isDrafted={isDrafted}
                  isSaved={isSaved}
                  onSelect={onDraftSelect}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;