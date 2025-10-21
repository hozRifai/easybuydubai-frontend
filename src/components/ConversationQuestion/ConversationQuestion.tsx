import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Check,
  SkipForward,
  MessageSquare
} from 'lucide-react';
import './ConversationQuestion.css';

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface Question {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text_input' | 'range';
  options: Option[];
  has_other: boolean;
  other_prompt?: string;
  is_optional: boolean;
}

interface ConversationQuestionProps {
  question: Question;
  categoryName: string;
  categoryIcon: string;
  onAnswer: (answer: any, isOther: boolean, otherText?: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
  onAddNote?: (note: string) => void;
}

const ConversationQuestion: React.FC<ConversationQuestionProps> = ({
  question,
  categoryName,
  categoryIcon,
  onAnswer,
  onBack,
  onSkip,
  onAddNote
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [additionalNote, setAdditionalNote] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedOptions([]);
    setShowOtherInput(false);
    setOtherText('');
    setShowNoteInput(false);
    setAdditionalNote('');
    setIsAnswered(false);
  }, [question.id]);

  const handleOptionClick = (value: string) => {
    if (question.type === 'single_choice') {
      if (value === 'other') {
        setShowOtherInput(true);
        setSelectedOptions(['other']);
      } else {
        setSelectedOptions([value]);
        setShowOtherInput(false);
        setOtherText('');
      }
    } else if (question.type === 'multiple_choice') {
      if (value === 'other') {
        setShowOtherInput(true);
        if (!selectedOptions.includes('other')) {
          setSelectedOptions([...selectedOptions, 'other']);
        } else {
          setSelectedOptions(selectedOptions.filter(opt => opt !== 'other'));
          setShowOtherInput(false);
          setOtherText('');
        }
      } else {
        if (selectedOptions.includes(value)) {
          setSelectedOptions(selectedOptions.filter(opt => opt !== value));
        } else {
          setSelectedOptions([...selectedOptions, value]);
        }
      }
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0 || (showOtherInput && otherText.trim())) {
      const isOther = selectedOptions.includes('other');
      const answer = question.type === 'single_choice'
        ? (isOther ? otherText : selectedOptions[0])
        : (isOther ? [...selectedOptions.filter(o => o !== 'other'), otherText] : selectedOptions);

      onAnswer(answer, isOther, isOther ? otherText : undefined);
      setIsAnswered(true);

      // Add note if provided
      if (additionalNote.trim() && onAddNote) {
        onAddNote(additionalNote);
      }
    }
  };

  const handleAddNote = () => {
    if (additionalNote.trim() && onAddNote) {
      onAddNote(additionalNote);
      setAdditionalNote('');
      setShowNoteInput(false);
    }
  };

  const isSubmitDisabled = () => {
    if (question.type === 'text_input') {
      return !otherText.trim();
    }
    if (showOtherInput && selectedOptions.includes('other')) {
      return !otherText.trim();
    }
    return selectedOptions.length === 0;
  };

  return (
    <div className="conversation-question">
      {/* Category Header */}
      <div className="question-category-header">
        <span className="category-icon">{categoryIcon}</span>
        <span className="category-name">{categoryName}</span>
      </div>

      {/* Question Text */}
      <div className="question-text">
        <h3>{question.question}</h3>
        {question.is_optional && (
          <span className="optional-badge">Optional</span>
        )}
      </div>

      {/* Options Grid */}
      {question.type !== 'text_input' && (
        <div className={`options-grid ${question.type === 'multiple_choice' ? 'multi-select' : ''}`}>
          {question.options.map((option) => (
            <button
              key={option.value}
              className={`option-button ${
                selectedOptions.includes(option.value) ? 'selected' : ''
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.icon && <span className="option-icon">{option.icon}</span>}
              <span className="option-label">{option.label}</span>
              {selectedOptions.includes(option.value) && (
                <Check className="check-icon" size={16} />
              )}
            </button>
          ))}

          {/* Other Option */}
          {question.has_other && (
            <button
              className={`option-button other-option ${
                selectedOptions.includes('other') ? 'selected' : ''
              }`}
              onClick={() => handleOptionClick('other')}
            >
              <Edit3 size={18} />
              <span className="option-label">Other</span>
              {selectedOptions.includes('other') && (
                <Check className="check-icon" size={16} />
              )}
            </button>
          )}
        </div>
      )}

      {/* Other Input Field */}
      {(showOtherInput || question.type === 'text_input') && (
        <div className="other-input-container">
          <label className="other-input-label">
            {question.other_prompt || question.question}
          </label>
          <textarea
            className="other-input"
            placeholder="Tell us more..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            rows={3}
          />
        </div>
      )}

      {/* Multiple Choice Hint */}
      {question.type === 'multiple_choice' && (
        <div className="multi-select-hint">
          <MessageSquare size={14} />
          <span>You can select multiple options</span>
        </div>
      )}

      {/* Additional Note Section */}
      <div className="additional-note-section">
        {!showNoteInput ? (
          <button
            className="add-note-btn"
            onClick={() => setShowNoteInput(true)}
          >
            <Plus size={16} />
            <span>Add more details for this category</span>
          </button>
        ) : (
          <div className="note-input-container">
            <textarea
              className="note-input"
              placeholder="Any additional information you'd like to share..."
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              rows={2}
            />
            <div className="note-actions">
              <button
                className="note-save-btn"
                onClick={handleAddNote}
                disabled={!additionalNote.trim()}
              >
                Save Note
              </button>
              <button
                className="note-cancel-btn"
                onClick={() => {
                  setShowNoteInput(false);
                  setAdditionalNote('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="question-actions">
        <div className="navigation-buttons">
          {onBack && (
            <button className="back-btn" onClick={onBack}>
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          )}

          {onSkip && question.is_optional && (
            <button className="skip-btn" onClick={onSkip}>
              <SkipForward size={18} />
              <span>Skip Category</span>
            </button>
          )}
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Success Animation */}
      {isAnswered && (
        <div className="answer-success">
          <Check size={24} />
          <span>Answer recorded!</span>
        </div>
      )}
    </div>
  );
};

export default ConversationQuestion;