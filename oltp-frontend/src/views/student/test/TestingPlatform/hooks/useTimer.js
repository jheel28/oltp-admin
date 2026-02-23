import { useState, useEffect, useRef, useCallback } from "react";

export const useTimer = ({ endTimestamp, phase, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [warned30, setWarned30] = useState(false);
  const [warned5, setWarned5] = useState(false);
  const expiredRef = useRef(false);

  const tick = useCallback(() => {
    if (!endTimestamp || phase !== "exam") return;
    const remaining = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
    setTimeLeft(remaining);
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
    }
  }, [endTimestamp, phase, onExpire]);

  useEffect(() => {
    if (!endTimestamp || phase !== "exam") return;
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [tick]);

  const isUrgent = timeLeft !== null && timeLeft <= 300;
  const isWarning = timeLeft !== null && timeLeft <= 1800 && !isUrgent;

  const formatTime = (secs) => {
    if (secs === null) return "--:--";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  return { timeLeft, isUrgent, isWarning, formatTime, warned30, warned5, setWarned30, setWarned5 };
};