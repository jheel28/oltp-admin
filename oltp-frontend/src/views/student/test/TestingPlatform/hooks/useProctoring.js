import { useState, useEffect, useRef, useCallback } from "react";

const violationsKey = (testId) => `oltp_violations_${testId}`;

export const useProctoring = ({ phase, testId, onAutoSubmit, onPersist }) => {
  const [violations, setViolations] = useState(() => {
    if (!testId) return 0;
    const saved = sessionStorage.getItem(violationsKey(testId));
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const submitFiredRef = useRef(false);

  useEffect(() => {
    if (testId) sessionStorage.setItem(violationsKey(testId), String(violations));
  }, [violations, testId]);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch { /* user may deny */ }
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    const onVisChange = () => {
      if (!document.hidden) return;
      onPersist?.();
      setViolations((v) => {
        const next = v + 1;
        if (next >= 3 && !submitFiredRef.current) {
          submitFiredRef.current = true;
          setTimeout(() => onAutoSubmit(), 2000);
        }
        return next;
      });
    };
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, [phase, onAutoSubmit, onPersist]);

  useEffect(() => {
    if (phase !== "exam") return;
    const noCtx = (e) => e.preventDefault();
    const noKey = (e) => {
      if (e.key === "F12" || (e.ctrlKey && ["u", "s"].includes(e.key.toLowerCase())))
        e.preventDefault();
    };
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("keydown", noKey);
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("keydown", noKey);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exam") return;
    const onUnload = (e) => {
      onPersist?.();
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [phase, onPersist]);

  const markSubmitFired = useCallback(() => {
    submitFiredRef.current = true;
    if (testId) sessionStorage.removeItem(violationsKey(testId));
  }, [testId]);

  return { violations, isFullscreen, toggleFullscreen, markSubmitFired };
};