import React, { useState, useEffect } from 'react';
import './Question.css';

const Question = ({
  _id,
  questionText,
  options,
  difficulty,
  topic,
  onSelectOption,
  selectedOption,
  showCorrectAnswer,
  correctOption,
  questionNumber,
  totalQuestions
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(Date.now());

  // Timer for question
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleOptionSelect = (index, option) => {
    onSelectOption({
      text: option.text,
      index: index
    }, timeRemaining);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return '#10b981';
      case 'Medium':
        return '#f59e0b';
      case 'Hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="question-container">
      {/* Header */}
      <div className="question-header">
        <div className="question-meta">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="question-topic" style={{ backgroundColor: getDifficultyColor(difficulty) }}>
            {difficulty} - {topic}
          </span>
        </div>
        <div className="question-timer">
          Time: <span className="timer-value">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Question Text */}
      <div className="question-text">
        <h3>{questionText}</h3>
      </div>

      {/* Options */}
      <div className="options-container">
        {options && options.map((option, index) => {
          const isSelected = selectedOption && selectedOption.index === index;
          // Find correct option from options array (not from prop)
          const correctOptionFromArray = options.find(opt => opt.isCorrect === true);
          const isCorrectOption = correctOptionFromArray && correctOptionFromArray.text === option.text;
          const showAsCorrect = showCorrectAnswer && isCorrectOption;
          const showAsWrong = showCorrectAnswer && isSelected && !option.isCorrect;

          return (
            <div
              key={index}
              className={`option-item ${isSelected ? 'selected' : ''} ${
                showAsCorrect ? 'correct' : ''
              } ${showAsWrong ? 'incorrect' : ''}`}
              onClick={() => !showCorrectAnswer && handleOptionSelect(index, option)}
              style={{
                cursor: showCorrectAnswer ? 'default' : 'pointer',
                pointerEvents: showCorrectAnswer ? 'none' : 'auto'
              }}
            >
              <div className="option-radio">
                <input
                  type="radio"
                  name={`question-${_id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => {}}
                  disabled={showCorrectAnswer}
                />
                <span className="radio-label">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
              <div className="option-text">
                <p>{option.text}</p>
              </div>
              {showAsCorrect && (
                <span className="correct-badge">✓ Correct</span>
              )}
              {showAsWrong && (
                <span className="incorrect-badge">✗ Wrong</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Question Status */}
      <div className="question-status">
        <span className={`status-badge ${selectedOption ? 'attempted' : 'not-attempted'}`}>
          {selectedOption ? '✓ Attempted' : '○ Not Attempted'}
        </span>
      </div>
    </div>
  );
};

export default Question;
