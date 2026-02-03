import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ATTEMPT_API = `${API_BASE_URL}/api/beta/attempt`;

// Get token from localStorage
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

// Create an attempt (submit a single answer)
export const submitAttempt = async (attemptData) => {
  try {
    const response = await axios.post(
      `${ATTEMPT_API}/create/attempt`,
      attemptData,
      getAuthConfig()
    );
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error submitting attempt:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get all attempts by user for a specific test
export const getAttemptsByTest = async (userId, testId) => {
  try {
    const response = await axios.get(
      `${ATTEMPT_API}/get/attempts/${userId}/${testId}`,
      getAuthConfig()
    );
    return {
      success: true,
      data: response.data.attempts
    };
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      data: []
    };
  }
};

// Get single attempt details
export const getAttemptById = async (attemptId) => {
  try {
    const response = await axios.get(
      `${ATTEMPT_API}/get/attempt/${attemptId}`,
      getAuthConfig()
    );
    return {
      success: true,
      data: response.data.attempt
    };
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get question statistics
export const getQuestionStatistics = async (questionId) => {
  try {
    const response = await axios.get(
      `${ATTEMPT_API}/get/question/statistics/${questionId}`
    );
    return {
      success: true,
      data: response.data.stats
    };
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get all attempts (Admin/SuperAdmin)
export const getAllAttempts = async (role) => {
  try {
    const endpoint = role === 'Admin' 
      ? `${ATTEMPT_API}/admin/get/all/attempts`
      : `${ATTEMPT_API}/superadmin/get/all/attempts`;

    const response = await axios.get(endpoint, getAuthConfig());
    return {
      success: true,
      data: response.data.attempts
    };
  } catch (error) {
    console.error('Error fetching all attempts:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      data: []
    };
  }
};

// Update attempt (Admin - for marking/review)
export const updateAttempt = async (attemptId, updateData, role) => {
  try {
    const endpoint = role === 'Admin'
      ? `${ATTEMPT_API}/admin/update/attempt/${attemptId}`
      : `${ATTEMPT_API}/superadmin/update/attempt/${attemptId}`;

    const response = await axios.patch(
      endpoint,
      updateData,
      getAuthConfig()
    );
    return {
      success: true,
      data: response.data.attempt
    };
  } catch (error) {
    console.error('Error updating attempt:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Delete attempt
export const deleteAttempt = async (attemptId, role) => {
  try {
    const endpoint = role === 'Admin'
      ? `${ATTEMPT_API}/admin/delete/attempt/${attemptId}`
      : `${ATTEMPT_API}/superadmin/delete/attempt/${attemptId}`;

    const response = await axios.delete(endpoint, getAuthConfig());
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting attempt:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Calculate performance analytics
export const calculatePerformanceAnalytics = (attempts, totalQuestions, totalMarks) => {
  const totalAttempted = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const totalIncorrect = totalAttempted - totalCorrect;
  const totalSkipped = totalQuestions - totalAttempted;
  
  const totalMarksObtained = attempts.reduce((sum, a) => sum + (a.marksObtained || 0), 0);
  const percentage = totalMarks > 0 ? ((totalMarksObtained / totalMarks) * 100).toFixed(2) : 0;
  const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(2) : 0;
  
  const averageTimeTaken = totalAttempted > 0 
    ? (attempts.reduce((sum, a) => sum + a.timeTaken, 0) / totalAttempted).toFixed(2)
    : 0;

  return {
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    totalMarksObtained,
    totalMarks,
    percentage,
    accuracy,
    averageTimeTaken
  };
};

// Get attempts grouped by difficulty
export const getAttemptsByDifficulty = (attempts, questions) => {
  const byDifficulty = {
    Easy: [],
    Medium: [],
    Hard: []
  };

  attempts.forEach(attempt => {
    const question = questions.find(q => q._id === attempt.questionId);
    if (question && byDifficulty[question.difficulty]) {
      byDifficulty[question.difficulty].push(attempt);
    }
  });

  const stats = {};
  Object.keys(byDifficulty).forEach(difficulty => {
    const attemptsByDiff = byDifficulty[difficulty];
    stats[difficulty] = {
      total: attemptsByDiff.length,
      correct: attemptsByDiff.filter(a => a.isCorrect).length,
      incorrect: attemptsByDiff.filter(a => !a.isCorrect).length,
      accuracy: attemptsByDiff.length > 0 
        ? ((attemptsByDiff.filter(a => a.isCorrect).length / attemptsByDiff.length) * 100).toFixed(2)
        : 0
    };
  });

  return stats;
};
