import React, { useEffect, useState } from "react";
import { IoTrophy } from "react-icons/io5";

const BatchRank = ({ studentId, batch }) => {
  const [rank, setRank] = useState(null);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    if (!studentId || !batch) return;
    const compute = async () => {
      try {
        const [studRes, scoreRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/all/students`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/all/scores`),
        ]);
        const [studData, scoreData] = await Promise.all([studRes.json(), scoreRes.json()]);
        const batchStudents = (studData.students || []).filter((s) => s.batch === batch);
        const scored = batchStudents.map((s) => {
          const sScores = (scoreData.scores || []).filter((sc) => sc.studentId === s.studentId);
          const sum = sScores.reduce(
            (acc, sc) => acc + (parseFloat(sc.marksObtained) / parseFloat(sc.totalMarks || 1)) * 100,
            0
          );
          return { studentId: s.studentId, avg: sScores.length > 0 ? sum / sScores.length : 0 };
        });
        scored.sort((a, b) => b.avg - a.avg);
        const idx = scored.findIndex((s) => s.studentId === studentId);
        setRank(idx >= 0 ? idx + 1 : null);
        setTotal(batchStudents.length);
      } catch (_) {}
    };
    compute();
  }, [studentId, batch]);

  const subtitle = rank !== null && total !== null ? `${rank} / ${total}` : "—";
  const iconColor = rank === 1 ? "bg-yellow-500" : rank !== null && rank <= 3 ? "bg-blue-600" : "bg-slate-600";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-navy-800 dark:ring-navy-700">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconColor} text-white`}>
        <IoTrophy className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Batch Rank</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{subtitle}</p>
      </div>
    </div>
  );
};

export default BatchRank;