const STORAGE_PREFIX = "oltp_exam_v4_";

export const storageKey = (testId) => `${STORAGE_PREFIX}${testId}`;

export const saveState = (testId, payload) => {
  try {
    localStorage.setItem(
      storageKey(testId),
      JSON.stringify({ ...payload, savedAt: Date.now() })
    );
    return true;
  } catch {
    return false;
  }
};

export const loadState = (testId) => {
  try {
    const raw = localStorage.getItem(storageKey(testId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearState = (testId) => {
  try {
    localStorage.removeItem(storageKey(testId));
  } catch { /* noop */ }
};