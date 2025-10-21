import React from 'react';
import { Clock, CheckCircle, Circle, ChevronRight, X } from 'lucide-react';
import './ConversationTimeline.css';

interface TimelineCategory {
  id: string;
  name: string;
  icon: string;
  status: 'completed' | 'active' | 'skipped' | 'upcoming';
  is_optional: boolean;
}

interface TimelineProps {
  categories: TimelineCategory[];
  progress: {
    percentage_complete: number;
    time_elapsed: number;
    estimated_remaining: number;
    current_category_name: string;
  };
  onCategoryClick: (categoryId: string) => void;
  onScheduleLater: () => void;
}

const ConversationTimeline: React.FC<TimelineProps> = ({
  categories,
  progress,
  onCategoryClick,
  onScheduleLater
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="status-icon completed" size={20} />;
      case 'active':
        return <Circle className="status-icon active pulse" size={20} />;
      case 'skipped':
        return <X className="status-icon skipped" size={20} />;
      default:
        return <Circle className="status-icon upcoming" size={20} />;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return 'less than a minute';
    if (minutes === 1) return '1 minute';
    return `${Math.round(minutes)} minutes`;
  };

  return (
    <div className="conversation-timeline">
      {/* Header with Time Estimate */}
      <div className="timeline-header">
        <div className="time-info">
          <Clock size={20} />
          <span className="estimated-time">
            {formatTime(progress.estimated_remaining)} remaining
          </span>
        </div>
        <button
          className="schedule-later-btn"
          onClick={onScheduleLater}
        >
          Schedule for Later
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.percentage_complete}%` }}
          >
            <span className="progress-text">{progress.percentage_complete}% Complete</span>
          </div>
        </div>
      </div>

      {/* Timeline Categories */}
      <div className="timeline-categories">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`timeline-category ${category.status}`}
            onClick={() => category.status === 'completed' && onCategoryClick(category.id)}
          >
            {/* Connection Line */}
            {index < categories.length - 1 && (
              <div className={`connection-line ${
                categories[index + 1].status === 'completed' ||
                categories[index + 1].status === 'active' ? 'active' : ''
              }`} />
            )}

            {/* Category Item */}
            <div className="category-item">
              <div className="category-icon-wrapper">
                <span className="category-icon">{category.icon}</span>
                {getStatusIcon(category.status)}
              </div>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                {category.status === 'active' && (
                  <span className="current-label">Current</span>
                )}
                {category.is_optional && category.status === 'upcoming' && (
                  <span className="optional-label">Optional</span>
                )}
              </div>
            </div>

            {/* Arrow for active category */}
            {category.status === 'active' && (
              <ChevronRight className="active-arrow" size={16} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info */}
      <div className="current-step-info">
        <div className="step-indicator">
          <span className="step-label">Current Step:</span>
          <span className="step-name">{progress.current_category_name}</span>
        </div>
        <div className="time-elapsed">
          <span>Time spent: {formatTime(progress.time_elapsed)}</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationTimeline;