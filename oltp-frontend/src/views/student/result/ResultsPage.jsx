import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';

const ResultsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // summary, detailed, analytics
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchResults();
  }, [testId, userId]);

  const fetchResults = async () => {
    try {
      setLoading(true);

      // Get score summary
      const scoreResponse = await axios.get(
        `http://localhost:5000/api/beta/score/get/score/by-user-test/${userId}/${testId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Get attempts
      const attemptsResponse = await axios.get(
        `http://localhost:5000/api/beta/attempt/get/attempts/${userId}/${testId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setResults(scoreResponse.data);
      setAttempts(attemptsResponse.data.attempts || []);

      // Extract questions from attempts
      if (attemptsResponse.data.attempts) {
        const uniqueQuestions = [
          ...new Map(
            attemptsResponse.data.attempts.map(att => [att.questionId, att])
          ).values()
        ];
        setQuestions(uniqueQuestions);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="results-loading">
        <div className="spinner"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-error">
        <h2>No results found</h2>
        <button onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <h1>Test Results</h1>
        <p className="results-subtitle">Performance Summary</p>
      </div>

      {/* Score Card */}
      <div className="score-card">
        <div className="score-main">
          <div className="score-circle">
            <div className="score-value">
              {results.score?.percentage || results.percentage || 0}%
            </div>
            <div className="score-label">Score</div>
          </div>

          <div className="score-marks">
            <h3>
              {results.score?.marksObtained || results.marksObtained || 0}/
              {results.score?.totalMarks || results.totalMarks || 0}
            </h3>
            <p>Marks Obtained</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box correct">
            <span className="stat-number">
              {results.score?.totalCorrect || results.totalCorrect || 0}
            </span>
            <span className="stat-label">Correct</span>
          </div>

          <div className="stat-box incorrect">
            <span className="stat-number">
              {results.score?.totalIncorrect || results.totalIncorrect || 0}
            </span>
            <span className="stat-label">Incorrect</span>
          </div>

          <div className="stat-box skipped">
            <span className="stat-number">
              {results.score?.totalSkipped || results.totalSkipped || 0}
            </span>
            <span className="stat-label">Skipped</span>
          </div>

          <div className="stat-box time">
            <span className="stat-number">
              {Math.floor((results.score?.timeTaken || results.timeTaken || 0) / 60)}m
            </span>
            <span className="stat-label">Time Taken</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="results-tabs">
        <button
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`tab ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          Detailed Review
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="summary-section">
            <div className="summary-grid">
              <div className="summary-item">
                <label>Total Questions</label>
                <span>{results.score?.totalQuestions || results.totalQuestions || 0}</span>
              </div>

              <div className="summary-item">
                <label>Attempted</label>
                <span>
                  {(results.score?.totalCorrect || 0) +
                    (results.score?.totalIncorrect || 0)}
                </span>
              </div>

              <div className="summary-item">
                <label>Accuracy Rate</label>
                <span>
                  {attempts.length > 0
                    ? (
                        ((results.score?.totalCorrect || 0) /
                          ((results.score?.totalCorrect || 0) +
                            (results.score?.totalIncorrect || 0))) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </span>
              </div>

              <div className="summary-item">
                <label>Average Time/Question</label>
                <span>
                  {attempts.length > 0
                    ? (
                        (results.score?.timeTaken || 0) / attempts.length
                      ).toFixed(1)
                    : 0}
                  s
                </span>
              </div>
            </div>

            <div className="performance-bar">
              <h3>Performance Breakdown</h3>
              <div className="bar-container">
                <div
                  className="bar-segment correct"
                  style={{
                    width:
                      ((results.score?.totalCorrect || 0) /
                        (results.score?.totalQuestions || 1)) *
                      100 +
                      '%'
                  }}
                  title={`Correct: ${results.score?.totalCorrect || 0}`}
                ></div>
                <div
                  className="bar-segment incorrect"
                  style={{
                    width:
                      ((results.score?.totalIncorrect || 0) /
                        (results.score?.totalQuestions || 1)) *
                      100 +
                      '%'
                  }}
                  title={`Incorrect: ${results.score?.totalIncorrect || 0}`}
                ></div>
                <div
                  className="bar-segment skipped"
                  style={{
                    width:
                      ((results.score?.totalSkipped || 0) /
                        (results.score?.totalQuestions || 1)) *
                      100 +
                      '%'
                  }}
                  title={`Skipped: ${results.score?.totalSkipped || 0}`}
                ></div>
              </div>
              <div className="bar-legend">
                <span>
                  <span className="legend-color correct"></span> Correct
                </span>
                <span>
                  <span className="legend-color incorrect"></span> Incorrect
                </span>
                <span>
                  <span className="legend-color skipped"></span> Skipped
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Review Tab */}
        {activeTab === 'detailed' && (
          <div className="detailed-section">
            {attempts.map((attempt, index) => (
              <div key={attempt._id} className="question-review">
                <div
                  className="review-header"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === attempt._id ? null : attempt._id
                    )
                  }
                >
                  <div className="question-num">
                    <span className="number">Q{index + 1}</span>
                    <span className={`badge ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>
                      {attempt.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div className="question-title">
                    {attempt.questionId?.questionText || 'Question'}
                  </div>
                  <span className="expand-icon">
                    {expandedQuestion === attempt._id ? '▲' : '▼'}
                  </span>
                </div>

                {expandedQuestion === attempt._id && (
                  <div className="review-content">
                    <div className="options-review">
                      <h4>Your Answer:</h4>
                      <div className={`option-review ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>
                        <p>{attempt.selectedOption.text}</p>
                        <span className="time-taken">
                          Time: {attempt.timeTaken}s
                        </span>
                      </div>

                      {!attempt.isCorrect && (
                        <>
                          <h4 style={{ marginTop: '16px' }}>Correct Answer:</h4>
                          <div className="option-review correct">
                            <p>{attempt.questionId?.options?.find(opt => opt.isCorrect)?.text || 'N/A'}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {attempt.questionId?.explanation && (
                      <div className="explanation">
                        <h4>Explanation:</h4>
                        <p>{attempt.questionId.explanation}</p>
                      </div>
                    )}

                    <div className="question-meta">
                      <span className="difficulty">
                        {attempt.questionId?.difficulty} • {attempt.questionId?.topic}
                      </span>
                      <span className="marks">
                        {attempt.marksObtained}/{attempt.questionId?.marks || 1} marks
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Difficulty-wise Performance</h3>
                <div className="difficulty-stats">
                  {['Easy', 'Medium', 'Hard'].map(difficulty => {
                    const diffAttempts = attempts.filter(
                      a => a.questionId?.difficulty === difficulty
                    );
                    const correct = diffAttempts.filter(a => a.isCorrect).length;
                    return (
                      <div key={difficulty} className="difficulty-item">
                        <span className="label">{difficulty}</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width:
                                diffAttempts.length > 0
                                  ? (correct / diffAttempts.length) * 100 + '%'
                                  : 0
                            }}
                          ></div>
                        </div>
                        <span className="value">
                          {correct}/{diffAttempts.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="analytics-card">
                <h3>Time Analysis</h3>
                <div className="time-stats">
                  <div className="time-item">
                    <span>Total Time</span>
                    <span className="value">
                      {Math.floor((results.score?.timeTaken || 0) / 60)}m{' '}
                      {(results.score?.timeTaken || 0) % 60}s
                    </span>
                  </div>
                  <div className="time-item">
                    <span>Avg. Per Question</span>
                    <span className="value">
                      {attempts.length > 0
                        ? (
                            (results.score?.timeTaken || 0) / attempts.length
                          ).toFixed(1)
                        : 0}
                      s
                    </span>
                  </div>
                  <div className="time-item">
                    <span>Fastest Question</span>
                    <span className="value">
                      {attempts.length > 0
                        ? Math.min(...attempts.map(a => a.timeTaken))
                        : 0}
                      s
                    </span>
                  </div>
                  <div className="time-item">
                    <span>Slowest Question</span>
                    <span className="value">
                      {attempts.length > 0
                        ? Math.max(...attempts.map(a => a.timeTaken))
                        : 0}
                      s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="results-actions">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/student/tests')}
        >
          Back to Tests
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Results
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
