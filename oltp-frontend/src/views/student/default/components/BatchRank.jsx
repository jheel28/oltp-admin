import React, { useEffect, useState } from "react";
import Widget from "components/widget/Widget";
import { MdLeaderboard } from "react-icons/md";

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
        const studData = await studRes.json();
        const scoreData = await scoreRes.json();

        const batchStudents = (studData.students || []).filter(
          (s) => s.batch === batch
        );

        const scored = batchStudents.map((s) => {
          const scores = (scoreData.scores || []).filter(
            (sc) => sc.studentId === s.studentId
          );
          const total = scores.reduce(
            (acc, sc) =>
              acc + (parseFloat(sc.marksObtained) / parseFloat(sc.totalMarks || 1)) * 100,
            0
          );
          const avg = scores.length > 0 ? total / scores.length : 0;
          return { studentId: s.studentId, avg };
        });

        scored.sort((a, b) => b.avg - a.avg);

        const idx = scored.findIndex((s) => s.studentId === studentId);
        setRank(idx >= 0 ? idx + 1 : null);
        setTotal(batchStudents.length);
      } catch (err) {
        console.error("BatchRank error:", err);
      }
    };

    compute();
  }, [studentId, batch]);

  const subtitle =
    rank !== null && total !== null ? `${rank} / ${total}` : "—";

  return (
    <Widget
      icon={<MdLeaderboard className="h-6 w-6" />}
      title="Batch Rank"
      subtitle={subtitle}
    />
  );
};

export default BatchRank;