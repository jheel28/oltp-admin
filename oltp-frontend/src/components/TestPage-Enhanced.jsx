import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TestPage.css";

const TestPage = ({ testId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);

  // 🔄 Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/questions/${testId || ""}`
        );

        if (response.data.success) {
          setQuestions(response.data.data);
          // Initialize selectedAnswers object
          const initialAnswers = {};
          response.data.data.forEach((q, idx) => {
            initialAnswers[q._id] = null;
          });
          setSelectedAnswers(initialAnswers);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  // 📝 Handle option selection
  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  // ✅ Submit answer and check correctness
  const submitCurrentAnswer = async () => {
    const question = questions[currentQuestionIndex];
    const selectedOptionIndex = selectedAnswers[question._id];

    if (selectedOptionIndex === null || selectedOptionIndex === undefined) {
      alert("Please select an option");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post("http://localhost:5000/api/answer", {
        questionId: question._id,
        selectedOption: selectedOptionIndex,
        userId: localStorage.getItem("userId"),
        testId: testId,
      });

      if (response.data.success) {
        console.log("Answer result:", response.data.data);

        // Move to next question
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Test completed
          await getTestResults();
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error submitting answer");
    } finally {
      setSubmitting(false);
    }
  };

  // 📊 Get test results
  const getTestResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/answer/stats", {
        params: {
          userId: localStorage.getItem("userId"),
          testId: testId,
        },
      });

      if (response.data.success) {
        setResults(response.data.data);
        setTestCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="test-container loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  // ✅ Test completed - show results
  if (testCompleted && results) {
    const percentage = parseFloat(results.percentage);
    return (
      <div className="test-container results-container">
        <div className="results-card">
          <h2>Test Completed! 🎉</h2>
          <div className="results-stats">
            <div className="stat">
              <h3>Total Questions</h3>
              <p className="stat-value">{results.totalQuestions}</p>
            </div>
            <div className="stat correct">
              <h3>Correct</h3>
              <p className="stat-value">{results.correct}</p>
            </div>
            <div className="stat incorrect">
              <h3>Incorrect</h3>
              <p className="stat-value">{results.incorrect}</p>
            </div>
            <div className="stat percentage">
              <h3>Percentage</h3>
              <p className="stat-value">{results.percentage}%</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = "/student/dashboard"}
            className="btn-continue"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 📋 Active test - show question
  if (questions.length === 0) {
    return (
      <div className="test-container">
        <p>No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = selectedAnswers[currentQuestion._id] !== null && selectedAnswers[currentQuestion._id] !== undefined;

  return (
    <div className="test-container">
      {/* 🔝 Header with progress */}
      <div className="test-header">
        <h1>Test Questions</h1>
        <div className="question-counter">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* 📊 Progress bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {/* 📝 Question card */}
      <div className="question-card">
        <div className="question-header">
          <h2 className="question-text">{currentQuestion.questionText}</h2>
          <div className="question-meta">
            <span className={`difficulty ${currentQuestion.difficulty?.toLowerCase() || "medium"}`}>
              {currentQuestion.difficulty || "Medium"}
            </span>
            <span className="marks">Marks: {currentQuestion.marks || 1}</span>
            <span className="topic">{currentQuestion.topic || "General"}</span>
          </div>
        </div>

        {/* 🎯 Options - loop with map */}
        <div className="options-container">
          {currentQuestion.options.map((opt, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedAnswers[currentQuestion._id] === index ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect(currentQuestion._id, index)}
            >
              <span className="option-label">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="option-text">{opt.text}</span>
              {selectedAnswers[currentQuestion._id] === index && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* 🎮 Navigation buttons */}
        <div className="button-group">
          <button
            onClick={() =>
              currentQuestionIndex > 0 &&
              setCurrentQuestionIndex(currentQuestionIndex - 1)
            }
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>

          <button
            onClick={submitCurrentAnswer}
            disabled={!isAnswered || submitting}
            className={`btn btn-primary ${submitting ? "loading" : ""}`}
          >
            {submitting ? (
              <>
                <span className="spinner-mini"></span> Checking...
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              "Submit Test"
            ) : (
              "Next Question"
            )}
          </button>

          <button
            onClick={() =>
              currentQuestionIndex < questions.length - 1 &&
              setCurrentQuestionIndex(currentQuestionIndex + 1)
            }
            disabled={currentQuestionIndex === questions.length - 1}
            className="btn btn-secondary"
          >
            Next →
          </button>
        </div>

        {/* ℹ️ Hint */}
        <div className="answer-hint">
          {!isAnswered && (
            <p className="hint-warning">⚠️ Please select an option to continue</p>
          )}
          {isAnswered && (
            <p className="hint-success">✓ Answer selected - Ready to proceed</p>
          )}
        </div>
      </div>

      {/* 🗺️ Question navigator */}
      <div className="question-navigator">
        <h4>Questions Navigator</h4>
        <div className="navigator-grid">
          {questions.map((q, idx) => (
            <button
              key={idx}
              className={`nav-btn ${
                idx === currentQuestionIndex ? "active" : ""
              } ${selectedAnswers[q._id] !== null && selectedAnswers[q._id] !== undefined ? "answered" : ""}`}
              onClick={() => setCurrentQuestionIndex(idx)}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
