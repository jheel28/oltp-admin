import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Question from '../../../components/question/Question';
import useAttempt from '../../../components/use-attempt-hook';
import './TestPage.css';

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [questionsMap, setQuestionsMap] = useState({});

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const {
    trackAttempt,
    submitAllAttempts,
    getAttemptStats
  } = useAttempt(testId, userId, 0, 0);

  useEffect(() => {
    fetchTestAndQuestions();
  }, [testId]);

  const fetchTestAndQuestions = async () => {
    try {
      setLoading(true);

      // Get test details
      const testResponse = await axios.get(
        `http://localhost:5000/api/beta/test/get/test/byid/${testId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTest(testResponse.data);

      // Get questions for this test
      const questionsResponse = await axios.get(
        `http://localhost:5000/api/beta/question/get/questions/byquestionpaperid/${testResponse.data.questionPaperId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setQuestions(questionsResponse.data);
      
      // Create a map for quick access
      const map = {};
      questionsResponse.data.forEach((q) => {
        map[q._id] = { selectedOption: null, timeTaken: 0 };
      });
      setQuestionsMap(map);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test:', error);
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, option, timeTaken) => {
    setQuestionsMap(prev => ({
      ...prev,
      [questionId]: { selectedOption: option, timeTaken }
    }));

    trackAttempt(questionId, option, timeTaken);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);

    const result = await submitAllAttempts();

    if (result.success) {
      setShowConfirmSubmit(false);
      // Redirect to results
      navigate(`/student/results/${testId}`);
    } else {
      alert('Error submitting test: ' + result.error);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="test-loading">
        <div className="spinner"></div>
        <p>Loading test...</p>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="test-error">
        <h2>Test not found</h2>
        <button onClick={() => navigate('/student/tests')}>Back to Tests</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const stats = getAttemptStats();
  const currentQuestionData = questionsMap[currentQuestion._id];

  return (
    <div className="test-container">
      {/* Header */}
      <div className="test-header">
        <div className="test-info">
          <h1>{test.name}</h1>
          <p>{test.description}</p>
        </div>
        <div className="test-stats">
          <div className="stat">
            <span className="stat-label">Question</span>
            <span className="stat-value">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Attempted</span>
            <span className="stat-value">{stats.totalAttempted}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Skipped</span>
            <span className="stat-value">{stats.totalSkipped}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="test-content">
        {/* Question Panel */}
        <div className="question-panel">
          <Question
            {...currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onSelectOption={(option, timeTaken) =>
              handleOptionSelect(currentQuestion._id, option, timeTaken)
            }
            selectedOption={currentQuestionData.selectedOption}
            showCorrectAnswer={false}
          />
        </div>

        {/* Navigation Panel */}
        <div className="navigation-panel">
          {/* Quick Question Navigator */}
          <div className="question-navigator">
            <h4>All Questions</h4>
            <div className="question-grid">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  className={`question-btn ${
                    idx === currentQuestionIndex ? 'active' : ''
                  } ${questionsMap[q._id]?.selectedOption ? 'attempted' : ''}`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="navigator-legend">
            <div className="legend-item">
              <span className="legend-box attempted"></span>
              <span>Attempted</span>
            </div>
            <div className="legend-item">
              <span className="legend-box unattempted"></span>
              <span>Unattempted</span>
            </div>
            <div className="legend-item">
              <span className="legend-box active"></span>
              <span>Current</span>
            </div>
          </div>

          {/* Test Summary */}
          <div className="test-summary">
            <h4>Test Summary</h4>
            <div className="summary-items">
              <div className="summary-item">
                <span>Total:</span>
                <span>{questions.length}</span>
              </div>
              <div className="summary-item">
                <span>Attempted:</span>
                <span>{stats.totalAttempted}</span>
              </div>
              <div className="summary-item">
                <span>Skipped:</span>
                <span>{stats.totalSkipped}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="test-footer">
        <div className="footer-left">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="footer-right">
          <button
            className="btn btn-warning"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit without submitting?')) {
                navigate('/student/tests');
              }
            }}
          >
            Exit Test
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowConfirmSubmit(true)}
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Submit Test?</h2>
            <p>Are you sure you want to submit your test?</p>

            <div className="modal-stats">
              <div className="modal-stat">
                <span>Total Questions: {questions.length}</span>
              </div>
              <div className="modal-stat">
                <span>Attempted: {stats.totalAttempted}</span>
              </div>
              <div className="modal-stat">
                <span>Skipped: {stats.totalSkipped}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmSubmit(false)}
                disabled={submitting}
              >
                Continue Test
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitTest}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
