import { useState, useCallback, useMemo, useEffect, useRef } from "react";

export const STATUS = {
  0: { bg: "bg-gray-100 text-gray-500 border-gray-300", label: "Not Visited" },
  1: { bg: "bg-red-500 text-white border-red-600", label: "Not Answered" },
  2: { bg: "bg-green-500 text-white border-green-600", label: "Answered" },
  3: { bg: "bg-purple-500 text-white border-purple-600", label: "Marked for Review" },
  4: { bg: "bg-purple-500 text-white border-purple-600", label: "Answered & Marked" },
};

export const answerIsEmpty = (a) =>
  a === null || a === undefined ||
  (Array.isArray(a) && a.length === 0) ||
  (typeof a === "string" && a.trim() === "");

export const answersEqual = (a, b) => {
  if (answerIsEmpty(a) && answerIsEmpty(b)) return true;
  if (answerIsEmpty(a) || answerIsEmpty(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return [...a].sort().toString() === [...b].sort().toString();
  }
  return String(a) === String(b);
};

export const getCorrectAnswer = (q) => {
  if (q.type === "MSQ") return (q.correctOptions || []).map(Number);
  if (q.type === "NAT") return { min: q.natMin, max: q.natMax };
  const val = q.correctOption;
  const num = Number(val);
  return isNaN(num) ? val : num;
};

export const scoreQuestion = (q, chosen, paper) => {
  const marksEach = parseFloat(paper?.marksPerQuestion) || 4;
  const marks = parseFloat(q.marksPositive) > 0 ? parseFloat(q.marksPositive) : marksEach;
  const negFrac = parseFloat(paper?.negativeFraction) || 0.25;
  const neg = parseFloat(q.marksNegative) > 0 ? parseFloat(q.marksNegative) : marks * negFrac;

  if (answerIsEmpty(chosen)) return 0;

  let isCorrect = false;

  if (q.type === "NAT") {
    const val = parseFloat(chosen);
    isCorrect = !isNaN(val) && val >= parseFloat(q.natMin) && val <= parseFloat(q.natMax);
  } else if (q.type === "MSQ") {
    const correctArr = (q.correctOptions || []).map(Number);
    const chosenArr = (Array.isArray(chosen) ? chosen : [chosen]).map(Number);
    isCorrect =
      chosenArr.length === correctArr.length &&
      chosenArr.every((c) => correctArr.includes(c));
  } else {
    const chosenVal = Array.isArray(chosen) ? chosen[0] : chosen;
    isCorrect = String(chosenVal) === String(q.correctOption);
  }

  if (isCorrect) return marks;
  if (paper?.negativeMarking) return -neg;
  return 0;
};

export const useExamAnswers = (questionCount) => {
  const [answers, setAnswers] = useState(() => Array(questionCount).fill(null));
  const [drafts, setDrafts] = useState(() => Array(questionCount).fill(null));
  const [statuses, setStatuses] = useState(() => Array(questionCount).fill(0));
  const [currentIdx, setCurrentIdx] = useState(0);

  // When questions finish loading (count goes from 0 → N), properly size
  // all arrays. This handles the async fetch in testingScreen.
  const didInitRef = useRef(questionCount > 0);
  useEffect(() => {
    if (questionCount > 0 && !didInitRef.current) {
      didInitRef.current = true;
      setAnswers(Array(questionCount).fill(null));
      setDrafts(Array(questionCount).fill(null));
      setStatuses(Array(questionCount).fill(0));
    }
  }, [questionCount]);

  const currentDraft = drafts[currentIdx] ?? null;
  const savedAnswer = answers[currentIdx] ?? null;
  const hasDraft = !answersEqual(currentDraft, savedAnswer);

  const restore = useCallback((savedAnswers, savedStatuses, savedIdx) => {
    setAnswers(savedAnswers);
    setDrafts(savedAnswers.map((a) => a));
    setStatuses(savedStatuses);
    setCurrentIdx(savedIdx || 0);
    // Mark as initialized so the size-init effect above does not overwrite
    didInitRef.current = true;
  }, []);

  const updateDraft = useCallback((type, optIdx) => {
    setDrafts((prev) => {
      const next = [...prev];
      const cur = prev[currentIdx] ?? null;
      if (type === "NAT") {
        next[currentIdx] = optIdx;
      } else if (type === "MSQ") {
        const arr = Array.isArray(cur) ? cur : [];
        next[currentIdx] = arr.includes(optIdx)
          ? arr.filter((x) => x !== optIdx)
          : [...arr, optIdx];
      } else {
        next[currentIdx] = cur === optIdx ? null : optIdx;
      }
      return next;
    });
  }, [currentIdx]);

  const clearDraft = useCallback(() => {
    setDrafts((prev) => { const n = [...prev]; n[currentIdx] = null; return n; });
  }, [currentIdx]);

  const commitDraft = useCallback(() => {
    const draft = drafts[currentIdx] ?? null;
    setAnswers((prev) => {
      const n = [...prev];
      n[currentIdx] = answerIsEmpty(draft) ? null : draft;
      return n;
    });
    setStatuses((prev) => {
      const n = [...prev];
      const isEmpty = answerIsEmpty(draft);
      const isMarked = n[currentIdx] === 3 || n[currentIdx] === 4;
      n[currentIdx] = isEmpty ? (isMarked ? 3 : 1) : (isMarked ? 4 : 2);
      return n;
    });
    return answerIsEmpty(draft) ? null : draft;
  }, [currentIdx, drafts]);

  const goTo = useCallback((idx) => {
    setCurrentIdx(idx);
    setStatuses((prev) => {
      if (prev[idx] !== 0 && prev[idx] !== undefined) return prev;
      const n = [...prev]; n[idx] = 1; return n;
    });
    setDrafts((prev) => {
      const n = [...prev];
      n[idx] = answers[idx] ?? null;
      return n;
    });
  }, [answers]);

  const toggleMark = useCallback(() => {
    setStatuses((prev) => {
      const n = [...prev];
      const cur = n[currentIdx];
      const hasSaved = !answerIsEmpty(answers[currentIdx]);
      n[currentIdx] = (cur === 3 || cur === 4)
        ? (hasSaved ? 2 : 1)
        : (hasSaved ? 4 : 3);
      return n;
    });
  }, [currentIdx, answers]);

  const stats = useMemo(() => ({
    answered: answers.filter((a) => !answerIsEmpty(a)).length,
    marked: statuses.filter((s) => s === 3 || s === 4).length,
    notVisited: statuses.filter((s) => s === 0 || s === undefined).length,
    notAnswered: statuses.filter((s) => s === 1).length,
    answeredMarked: statuses.filter((s) => s === 4).length,
    markedOnly: statuses.filter((s) => s === 3).length,
  }), [answers, statuses]);

  return {
    answers, drafts, statuses, currentIdx, currentDraft, savedAnswer, hasDraft,
    restore, updateDraft, clearDraft, commitDraft, goTo, toggleMark, stats,
    setAnswers, setStatuses, setCurrentIdx,
  };
};