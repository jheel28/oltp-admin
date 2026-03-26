import React from "react";

const SubmitScreen = ({ stats, questionCount, hasDraft, currentQuestion, submitting, onReturn, onSubmit }) => {
  const rows = [
    { label: "Answered", value: stats.answered, cls: "bg-green-50 border-green-200 text-green-700" },
    { label: "Not Answered", value: stats.notAnswered, cls: "bg-red-50 border-red-200 text-red-700" },
    { label: "Marked for Review", value: stats.markedOnly, cls: "bg-purple-50 border-purple-200 text-purple-700" },
    { label: "Answered & Marked", value: stats.answeredMarked, cls: "bg-purple-50 border-purple-200 text-purple-700" },
    { label: "Not Visited", value: stats.notVisited, cls: "bg-gray-50 border-gray-200 text-gray-500" },
    { label: "Total Questions", value: questionCount, cls: "bg-teal-50 border-teal-200 text-teal-700" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="bg-cyan-900 px-6 py-3 text-center font-black text-white shadow">
        Submit Confirmation
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-1 text-2xl font-black text-navy-700">Submit Examination?</h2>
          <p className="mb-6 text-sm text-gray-500">Once submitted, your answers cannot be changed.</p>

          {hasDraft && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              ⚠ You have an unsaved draft on <strong>Q{currentQuestion + 1}</strong>. It will NOT be submitted unless you go back and click Save & Next.
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3">
            {rows.map((row) => (
              <div key={row.label} className={`rounded-xl border p-3 ${row.cls}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{row.label}</p>
                <p className="mt-0.5 text-2xl font-black">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onReturn}
              className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Return to Exam
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="flex-1 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600 disabled:opacity-60 transition"
            >
              {submitting ? "Submitting…" : "Submit Final"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitScreen;