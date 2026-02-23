import { useState, useEffect, useRef, useCallback } from "react";

export const useProctoring = ({ phase, onAutoSubmit, onPersist }) => {
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const submitFiredRef = useRef(false);

  // Fullscreen change listener
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

  // Tab-switch / visibility detection
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

  // Block right-click & dangerous keyboard shortcuts during exam
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

  // Warn before unload
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

  const markSubmitFired = () => { submitFiredRef.current = true; };

  return { violations, isFullscreen, toggleFullscreen, markSubmitFired };
};