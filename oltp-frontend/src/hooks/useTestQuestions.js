import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

/**
 * ✅ useTestQuestions - Custom hook for test question management
 * Handles fetching questions, submitting answers, and tracking results
 */
const useTestQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 📋 Fetch questions by test ID
   */
  const fetchQuestions = useCallback(async (testId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/questions/${testId || ""}`);

      if (response.data.success) {
        setQuestions(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch questions");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error fetching questions";
      setError(errorMsg);
      console.error("Fetch questions error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ Submit answer and check if correct
   */
  const submitAnswer = useCallback(async (questionId, selectedOption, userId, testId) => {
    try {
      setSubmitting(true);

      const response = await axios.post(`${API_URL}/answer`, {
        questionId,
        selectedOption,
        userId,
        testId,
      });

      if (response.data.success) {
        return response.data.data; // Returns { isCorrect, correctAnswer, explanation, marks }
      } else {
        throw new Error(response.data.message || "Failed to submit answer");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error submitting answer";
      setError(errorMsg);
      console.error("Submit answer error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  /**
   * 📊 Get test statistics
   */
  const getTestStats = useCallback(async (userId, testId) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/answer/stats`, {
        params: { userId, testId },
      });

      if (response.data.success) {
        setResults(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error fetching statistics";
      setError(errorMsg);
      console.error("Fetch stats error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 Reset all states
   */
  const reset = useCallback(() => {
    setQuestions([]);
    setResults(null);
    setError(null);
    setLoading(false);
    setSubmitting(false);
  }, []);

  return {
    // State
    loading,
    submitting,
    questions,
    results,
    error,

    // Methods
    fetchQuestions,
    submitAnswer,
    getTestStats,
    reset,

    // Derived
    totalQuestions: questions.length,
  };
};

export default useTestQuestions;
