/**
 * SAMPLE DATA STRUCTURES FOR TESTING
 * Use these to understand the data flow and test your implementation
 */

// ============================================
// SAMPLE QUESTION DATA (Updated Schema)
// ============================================

const sampleQuestion = {
  _id: "507f1f77bcf86cd799439011",
  questionPaperId: "paper123",
  questionText: "What is the capital of France?",
  questionImage: null,
  options: [
    {
      text: "London",
      isCorrect: false,
      image: null
    },
    {
      text: "Paris",
      isCorrect: true,
      image: null
    },
    {
      text: "Berlin",
      isCorrect: false,
      image: null
    },
    {
      text: "Madrid",
      isCorrect: false,
      image: null
    }
  ],
  difficulty: "Easy",
  topic: "Geography",
  marks: 1,
  explanation: "Paris is the capital and largest city of France. It is known as the 'City of Light' for its historic contributions to art, science, and philosophy.",
  createdBy: "admin123",
  createdAt: "2024-02-03T10:30:00Z",
  updatedAt: "2024-02-03T10:30:00Z"
};

// ============================================
// SAMPLE ATTEMPT DATA (New)
// ============================================

const sampleAttempt = {
  _id: "507f1f77bcf86cd799439012",
  userId: "507f1f77bcf86cd799439001",
  questionId: "507f1f77bcf86cd799439011",
  testId: "507f1f77bcf86cd799439005",
  selectedOption: {
    text: "Paris",
    index: 1
  },
  isCorrect: true,
  timeTaken: 45, // seconds
  marksObtained: 1,
  attemptedAt: "2024-02-03T10:45:00Z",
  reviewed: false,
  createdAt: "2024-02-03T10:45:00Z",
  updatedAt: "2024-02-03T10:45:00Z"
};

const sampleWrongAttempt = {
  _id: "507f1f77bcf86cd799439013",
  userId: "507f1f77bcf86cd799439002",
  questionId: "507f1f77bcf86cd799439011",
  testId: "507f1f77bcf86cd799439005",
  selectedOption: {
    text: "London",
    index: 0
  },
  isCorrect: false,
  timeTaken: 62,
  marksObtained: 0,
  attemptedAt: "2024-02-03T10:46:30Z",
  reviewed: false,
  createdAt: "2024-02-03T10:46:30Z",
  updatedAt: "2024-02-03T10:46:30Z"
};

// ============================================
// SAMPLE SCORE DATA (Updated)
// ============================================

const sampleScore = {
  _id: "507f1f77bcf86cd799439020",
  testId: "507f1f77bcf86cd799439005",
  studentId: "507f1f77bcf86cd799439001",
  questionPaperId: "paper123",
  attemptIds: [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015"
  ],
  totalMarks: 30,
  marksObtained: 25,
  totalCorrect: 25,
  totalIncorrect: 4,
  totalSkipped: 1,
  totalQuestions: 30,
  percentage: 83.33,
  timeTaken: 1800, // 30 minutes in seconds
  startedAt: "2024-02-03T10:30:00Z",
  completedAt: "2024-02-03T11:00:00Z",
  status: "Submitted",
  createdAt: "2024-02-03T11:00:00Z",
  updatedAt: "2024-02-03T11:00:00Z"
};

// ============================================
// SAMPLE API RESPONSES
// ============================================

// 1. Create Attempt Response
const createAttemptResponse = {
  message: "Attempt created successfully",
  attempt: sampleAttempt,
  isCorrect: true
};

// 2. Get Attempts Response
const getAttemptsResponse = {
  message: "Attempts retrieved successfully",
  attempts: [
    sampleAttempt,
    sampleWrongAttempt,
    // ... more attempts
  ]
};

// 3. Get Question Statistics Response
const questionStatsResponse = {
  message: "Question statistics retrieved",
  stats: {
    questionId: "507f1f77bcf86cd799439011",
    totalAttempts: 150,
    correctAttempts: 135,
    incorrectAttempts: 15,
    correctPercentage: "90.00",
    avgTimeTaken: "52.30"
  }
};

// ============================================
// SAMPLE FRONTEND STATE (TestPage)
// ============================================

const testPageState = {
  test: {
    _id: "507f1f77bcf86cd799439005",
    name: "General Knowledge Quiz",
    description: "Test your knowledge on various topics",
    questionPaperId: "paper123",
    totalQuestions: 30,
    totalMarks: 30,
    duration: 3600 // 1 hour in seconds
  },
  questions: [
    sampleQuestion,
    // ... more questions
  ],
  currentQuestionIndex: 0,
  questionsMap: {
    "507f1f77bcf86cd799439011": {
      selectedOption: {
        text: "Paris",
        index: 1
      },
      timeTaken: 45
    },
    "507f1f77bcf86cd799439016": {
      selectedOption: null,
      timeTaken: 0
    },
    "507f1f77bcf86cd799439017": {
      selectedOption: {
        text: "Option B",
        index: 1
      },
      timeTaken: 30
    }
  }
};

// ============================================
// SAMPLE FRONTEND STATE (ResultsPage)
// ============================================

const resultsPageState = {
  results: {
    score: sampleScore,
    message: "Results retrieved successfully"
  },
  attempts: [
    sampleAttempt,
    sampleWrongAttempt,
    // ... all attempts
  ],
  activeTab: "summary", // "summary" | "detailed" | "analytics"
  expandedQuestion: null
};

// ============================================
// SAMPLE PERFORMANCE ANALYTICS
// ============================================

const performanceAnalytics = {
  totalAttempted: 29,
  totalCorrect: 25,
  totalIncorrect: 4,
  totalSkipped: 1,
  totalMarksObtained: 25,
  totalMarks: 30,
  percentage: 83.33,
  accuracy: 86.21, // (25/29)*100
  averageTimeTaken: 62.07 // total time / attempts
};

// ============================================
// SAMPLE DIFFICULTY-WISE PERFORMANCE
// ============================================

const difficultyStats = {
  Easy: {
    total: 10,
    correct: 10,
    incorrect: 0,
    accuracy: 100
  },
  Medium: {
    total: 12,
    correct: 11,
    incorrect: 1,
    accuracy: 91.67
  },
  Hard: {
    total: 8,
    correct: 4,
    incorrect: 4,
    accuracy: 50
  }
};

// ============================================
// MONGODB QUERIES (For reference)
// ============================================

// Create Question
db.questions.insertOne({
  questionPaperId: "paper123",
  questionText: "What is the capital of France?",
  options: [
    { text: "London", isCorrect: false },
    { text: "Paris", isCorrect: true },
    { text: "Berlin", isCorrect: false },
    { text: "Madrid", isCorrect: false }
  ],
  difficulty: "Easy",
  topic: "Geography",
  marks: 1
});

// Create Attempt
db.attempts.insertOne({
  userId: ObjectId("507f1f77bcf86cd799439001"),
  questionId: ObjectId("507f1f77bcf86cd799439011"),
  testId: ObjectId("507f1f77bcf86cd799439005"),
  selectedOption: { text: "Paris", index: 1 },
  isCorrect: true,
  timeTaken: 45,
  marksObtained: 1
});

// Get attempts for a student's test
db.attempts.find({
  userId: ObjectId("507f1f77bcf86cd799439001"),
  testId: ObjectId("507f1f77bcf86cd799439005")
});

// Get statistics for a question
db.attempts.aggregate([
  { $match: { questionId: ObjectId("507f1f77bcf86cd799439011") } },
  { 
    $group: {
      _id: "$questionId",
      totalAttempts: { $sum: 1 },
      correctAttempts: {
        $sum: { $cond: ["$isCorrect", 1, 0] }
      },
      avgTimeTaken: { $avg: "$timeTaken" }
    }
  }
]);

// ============================================
// JAVASCRIPT TEST HELPERS
// ============================================

// Calculate accuracy
const calculateAccuracy = (attempts) => {
  const correct = attempts.filter(a => a.isCorrect).length;
  return attempts.length > 0 ? (correct / attempts.length * 100).toFixed(2) : 0;
};

// Calculate time in MM:SS format
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Check if answer is correct
const isAnswerCorrect = (selectedOption, correctOption) => {
  return selectedOption.text === correctOption.text;
};

// Get performance color
const getPerformanceColor = (percentage) => {
  if (percentage >= 80) return '#10b981'; // Green
  if (percentage >= 60) return '#f59e0b'; // Orange
  if (percentage >= 40) return '#ef4444'; // Red
  return '#6b7280'; // Gray
};

// ============================================
// REACT COMPONENT TEST DATA
// ============================================

// Mock useAttempt hook for testing
const mockUseAttempt = {
  attempts: [],
  loading: false,
  error: null,
  trackAttempt: (questionId, option, time) => {},
  submitAllAttempts: async () => ({ success: true }),
  getAttempts: async () => [],
  getQuestionStats: async () => null,
  getAttemptStats: () => ({
    totalAttempted: 25,
    totalCorrect: 20,
    totalIncorrect: 5,
    totalSkipped: 5,
    accuracy: 80
  }),
  resetAttempts: () => {}
};

// Mock axios for testing
const mockAxios = {
  get: async (url) => ({
    data: getAttemptsResponse
  }),
  post: async (url, data) => ({
    data: createAttemptResponse
  }),
  patch: async (url, data) => ({
    data: { message: "Updated" }
  }),
  delete: async (url) => ({
    data: { message: "Deleted" }
  })
};

// ============================================
// EXPORT FOR TESTING
// ============================================

export {
  sampleQuestion,
  sampleAttempt,
  sampleWrongAttempt,
  sampleScore,
  createAttemptResponse,
  getAttemptsResponse,
  questionStatsResponse,
  testPageState,
  resultsPageState,
  performanceAnalytics,
  difficultyStats,
  mockUseAttempt,
  mockAxios
};
