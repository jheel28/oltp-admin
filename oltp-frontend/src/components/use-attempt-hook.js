import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const useAttempt = (testId, userId, totalQuestions, totalMarks) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const attemptsRef = useRef([]);
  const startTimeRef = useRef(Date.now());

  // Track attempt locally
  const trackAttempt = useCallback((questionId, selectedOption, timeTaken) => {
    const attemptData = {
      questionId,
      selectedOption,
      timeTaken,
      userId,
      testId
    };

    attemptsRef.current.push(attemptData);
    setAttempts([...attemptsRef.current]);
  }, [userId, testId]);

  // Submit all attempts to backend
  const submitAllAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const totalTimeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Submit each attempt
      const submittedAttempts = [];
      for (const attempt of attemptsRef.current) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beta/attempt/create/attempt`,
          attempt,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        submittedAttempts.push(response.data.attempt);
      }

      // Get score summary
      const scoreResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beta/score/get/score/by-user-test/${userId}/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLoading(false);
      return {
        success: true,
        attempts: submittedAttempts,
        score: scoreResponse.data,
        totalTime: totalTimeTaken
      };
    } catch (err) {
      console.error('Error submitting attempts:', err);
      setError(err.response?.data?.message || 'Failed to submit attempts');
      setLoading(false);
      return {
        success: false,
        error: err.message
      };
    }
  }, [userId, testId]);

  // Get attempts for a test
  const getAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beta/attempt/get/attempts/${userId}/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAttempts(response.data.attempts);
      setLoading(false);
      return response.data.attempts;
    } catch (err) {
      console.error('Error fetching attempts:', err);
      setError(err.response?.data?.message || 'Failed to fetch attempts');
      setLoading(false);
      return [];
    }
  }, [userId, testId]);

  // Get question statistics
  const getQuestionStats = useCallback(async (questionId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/beta/attempt/get/question/statistics/${questionId}`
      );

      return response.data.stats;
    } catch (err) {
      console.error('Error fetching question stats:', err);
      return null;
    }
  }, []);

  // Calculate accuracy
  const getAttemptStats = useCallback(() => {
    const totalAttempted = attemptsRef.current.length;
    const totalCorrect = attemptsRef.current.filter(a => a.isCorrect).length;
    const totalIncorrect = totalAttempted - totalCorrect;
    const totalSkipped = totalQuestions - totalAttempted;
    const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(2) : 0;

    return {
      totalAttempted,
      totalCorrect,
      totalIncorrect,
      totalSkipped,
      accuracy
    };
  }, [totalQuestions]);

  // Reset attempts
  const resetAttempts = useCallback(() => {
    attemptsRef.current = [];
    setAttempts([]);
    startTimeRef.current = Date.now();
  }, []);

  return {
    attempts,
    loading,
    error,
    trackAttempt,
    submitAllAttempts,
    getAttempts,
    getQuestionStats,
    getAttemptStats,
    resetAttempts
  };
};

export default useAttempt;
