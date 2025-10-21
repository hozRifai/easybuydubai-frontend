import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@hooks/useChat';
import { useChatStore } from '@store/chatStore';
import { Navigation } from '@components';
import { conversationService, ConversationState } from '@services';
import ConversationTimeline from '../../components/ConversationTimeline/ConversationTimeline';
import ConversationQuestion from '../../components/ConversationQuestion/ConversationQuestion';
import ScheduleLater from '../../components/ScheduleLater/ScheduleLater';
import { Send, Bot, User, Sparkles, MessageSquare, ArrowRight, RefreshCw, CheckCircle, Clock, Calendar } from 'lucide-react';
import './EnhancedChat.css';
import './GuidedChat.css';

const EnhancedChat: React.FC = () => {
  const [conversationMode, setConversationMode] = useState<'welcome' | 'structured' | 'freeform' | 'complete'>('welcome');
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');

  // Free chat mode states
  const [freeMessage, setFreeMessage] = useState('');
  const { messages, sendMessage, isLoading: isChatLoading } = useChat();
  const { sessionId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-populate answers when question changes
  useEffect(() => {
    if (conversationState?.question && conversationState?.responses) {
      const questionId = conversationState.question.id;
      const existingResponse = conversationState.responses[questionId];

      if (existingResponse) {
        const responseValue = existingResponse.value;
        const isOther = existingResponse.is_other;
        const otherTextValue = existingResponse.other_text;

        if (conversationState.question.type === 'multiple_choice') {
          // Handle multiple choice
          if (Array.isArray(responseValue)) {
            setSelectedAnswers(isOther ? [...responseValue, 'other'] : responseValue);
          } else {
            setSelectedAnswers([responseValue]);
          }
        } else {
          // Handle single choice
          setSelectedAnswer(isOther ? 'other' : responseValue);
        }

        if (isOther && otherTextValue) {
          setOtherText(otherTextValue);
        }
      } else {
        // No existing response, clear selections
        setSelectedAnswer(null);
        setSelectedAnswers([]);
        setOtherText('');
      }
    }
  }, [conversationState?.question?.id]);

  const startStructuredConversation = async (reuseSession = false) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setOtherText('');

      let sessionToUse: string;
      if (reuseSession && conversationState?.session_id) {
        // Reuse existing session ID to maintain responses
        sessionToUse = conversationState.session_id;
      } else {
        // Generate a unique session ID for each new conversation
        sessionToUse = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      const response = await conversationService.startConversation(sessionToUse);

      // The response contains the first question directly
      if (response && response.current_question) {
        setConversationState({
          ...response,
          question: response.current_question
        });
      } else {
        setConversationState(response);
      }

      // Pre-populate answers if reusing session
      if (reuseSession && response.current_question) {
        populateExistingAnswer(response.current_question.id);
      }

      setConversationMode('structured');
    } catch (err) {
      setError('Failed to start conversation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const populateExistingAnswer = (questionId: string) => {
    // This will be populated from backend responses in the conversation state
    // For now, we'll handle it when we get the summary from backend
  };

  const handleAnswer = async (answer: any, isOther: boolean, otherText?: string) => {
    if (!conversationState) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await conversationService.submitAnswer({
        session_id: conversationState.session_id,
        question_id: conversationState.question?.id || '',
        answer,
        is_other: isOther,
        other_text: otherText
      });

      console.log('Submit answer response:', response);

      // Update conversation state with new question or completion
      if (response.next_question) {
        setConversationState({
          ...response,
          session_id: response.session_id || conversationState.session_id,
          question: response.next_question,
          responses: response.responses || conversationState.responses
        });
      } else if (response.status === 'complete') {
        setConversationState({
          ...response,
          session_id: response.session_id || conversationState.session_id,
          responses: response.responses || conversationState.responses
        });
        setConversationMode('complete');
      } else {
        // No next question but not complete - should not happen
        console.error('No next question and not complete:', response);
        setError('Unable to get next question. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to specific category if needed
    console.log('Category clicked:', categoryId);
  };

  const handleScheduleLater = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (data: any) => {
    try {
      await conversationService.scheduleForLater({
        session_id: conversationState?.session_id || sessionId || 'new',
        ...data
      });
      setShowScheduleModal(false);
    } catch (err) {
      console.error('Failed to schedule:', err);
    }
  };

  const handleAddNote = async (note: string) => {
    if (!conversationState) return;

    try {
      await conversationService.addCategoryNote(
        conversationState.session_id,
        conversationState.progress.current_category,
        note
      );
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleSkipCategory = async () => {
    if (!conversationState) return;

    try {
      setIsLoading(true);
      const response = await conversationService.skipCategory(
        conversationState.session_id,
        conversationState.progress.current_category
      );
      setConversationState({
        ...response,
        session_id: response.session_id || conversationState.session_id
      });
    } catch (err) {
      setError('Failed to skip category.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeChatSend = async () => {
    if (!freeMessage.trim() || isChatLoading) return;

    const userMessage = freeMessage.trim();
    setFreeMessage('');
    await sendMessage(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFreeChatSend();
    }
  };

  const renderWelcomeScreen = () => (
    <div className="enhanced-welcome">
      <h1>Welcome to EasyBuy Dubai</h1>
      <p className="welcome-subtitle">
        I'm your personal property assistant, here to help you find your dream home in Dubai
      </p>

      <div className="welcome-options">
        <div className="option-card structured" onClick={startStructuredConversation}>
          <div className="option-icon">
            <MessageSquare size={32} />
          </div>
          <h3>Guided Property Search</h3>
          <p>Let me ask you a few questions to find your perfect property match</p>
          <div className="option-features">
            <span>✓ Complete in 8-10 minutes</span>
            <span>✓ Personalized property matches</span>
            <span>✓ Expert recommendations</span>
          </div>
          <button className="option-btn primary">
            Start Guided Search
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="option-card freeform" onClick={() => setConversationMode('freeform')}>
          <div className="option-icon">
            <Send size={32} />
          </div>
          <h3>Free Conversation</h3>
          <p>Chat freely about your property needs and ask any questions</p>
          <div className="option-features">
            <span>✓ Flexible chat</span>
            <span>✓ Quick answers</span>
            <span>✓ General inquiries</span>
          </div>
          <button className="option-btn secondary">
            Start Free Chat
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const handleSubmitAnswer = async () => {
    const questionType = conversationState?.question?.type;

    if (questionType === 'multiple_choice') {
      if (selectedAnswers.length === 0 && !otherText.trim()) return;
      const isOther = selectedAnswers.includes('other');
      const answer = isOther ? [...selectedAnswers.filter(a => a !== 'other'), otherText] : selectedAnswers;
      await handleAnswer(answer, isOther, otherText);
      setSelectedAnswers([]);
      setOtherText('');
    } else {
      if (!selectedAnswer && !otherText.trim()) return;
      const isOther = selectedAnswer === 'other';
      const answer = isOther ? otherText : selectedAnswer;
      await handleAnswer(answer, isOther, otherText);
      setSelectedAnswer(null);
      setOtherText('');
    }
  };

  const renderStructuredConversation = () => {
    const currentCategory = conversationState?.timeline?.find(
      c => c.id === conversationState?.progress?.current_category
    );

    return (
      <div className="guided-chat-container">
        {/* Header */}
        <div className="guided-chat-header">
          <div className="header-left">
            <div className="category-badge">
              <span className="icon">{currentCategory?.icon || '📋'}</span>
              <span>{conversationState?.progress?.current_category_name || 'Getting Started'}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="progress-indicator">
              <Clock size={16} />
              <span>~{conversationState?.progress?.estimated_remaining || 10} min left</span>
            </div>
            <div className="progress-bar-mini">
              <div
                className="progress-bar-mini-fill"
                style={{ width: `${conversationState?.progress?.percentage_complete || 0}%` }}
              />
            </div>
            <span>{conversationState?.progress?.percentage_complete || 0}%</span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="guided-chat-messages">
          {conversationState?.question && (
            <div className="bot-question-message">
              <div className="bot-avatar">
                <div className="avatar-circle">
                  <Bot size={24} />
                </div>
                <span className="bot-name">EasyBuy Assistant</span>
              </div>

              <div className="question-bubble">
                <div className="question-text">
                  {conversationState.question.question}
                </div>

                {conversationState.question.type === 'single_choice' && (
                  <div className="answer-options">
                    {conversationState.question.options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`answer-option ${selectedAnswer === option.value ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAnswer(option.value);
                          setOtherText('');
                        }}
                      >
                        <span className="option-text">{option.label}</span>
                      </button>
                    ))}

                    {conversationState.question.has_other && (
                      <button
                        className={`answer-option ${selectedAnswer === 'other' ? 'selected' : ''}`}
                        onClick={() => setSelectedAnswer('other')}
                      >
                        <span className="option-text">Other (please specify)</span>
                      </button>
                    )}
                  </div>
                )}

                {conversationState.question.type === 'multiple_choice' && (
                  <div className="answer-options multiple-select">
                    <div className="multi-select-hint" style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                      ✓ You can select multiple options
                    </div>
                    {conversationState.question.options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`answer-option ${selectedAnswers.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => {
                          if (selectedAnswers.includes(option.value)) {
                            setSelectedAnswers(selectedAnswers.filter(a => a !== option.value));
                          } else {
                            setSelectedAnswers([...selectedAnswers, option.value]);
                          }
                        }}
                      >
                        <span className="option-text">{option.label}</span>
                        {selectedAnswers.includes(option.value) && <span style={{ marginLeft: '8px' }}>✓</span>}
                      </button>
                    ))}

                    {conversationState.question.has_other && (
                      <button
                        className={`answer-option ${selectedAnswers.includes('other') ? 'selected' : ''}`}
                        onClick={() => {
                          if (selectedAnswers.includes('other')) {
                            setSelectedAnswers(selectedAnswers.filter(a => a !== 'other'));
                            setOtherText('');
                          } else {
                            setSelectedAnswers([...selectedAnswers, 'other']);
                          }
                        }}
                      >
                        <span className="option-text">Other (please specify)</span>
                        {selectedAnswers.includes('other') && <span style={{ marginLeft: '8px' }}>✓</span>}
                      </button>
                    )}
                  </div>
                )}

                {((selectedAnswer === 'other') || (selectedAnswers.includes('other'))) && (
                  <div className="other-input-area">
                    <label className="other-input-label">
                      {conversationState.question.other_prompt || 'Please tell us more:'}
                    </label>
                    <textarea
                      className="other-input-field"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Type your answer here..."
                      autoFocus
                    />
                  </div>
                )}

                <div className="question-actions">
                  <button
                    className="submit-answer-btn"
                    onClick={handleSubmitAnswer}
                    disabled={
                      isLoading ||
                      (conversationState.question.type === 'multiple_choice'
                        ? (selectedAnswers.length === 0 || (selectedAnswers.includes('other') && !otherText.trim()))
                        : (!selectedAnswer || (selectedAnswer === 'other' && !otherText.trim())))
                    }
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {conversationState.question.is_optional && (
                    <button
                      className="skip-btn"
                      onClick={handleSkipCategory}
                      disabled={isLoading}
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {isLoading && !conversationState?.question && (
            <div className="loading-message">
              <div className="avatar-circle">
                <Bot size={24} />
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Preparing next question...</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="guided-chat-footer">
          <a href="#" className="schedule-later-link" onClick={(e) => {
            e.preventDefault();
            handleScheduleLater();
          }}>
            <Calendar size={16} />
            Schedule for later
          </a>
          <span className="help-text">
            Question {conversationState?.progress?.questions_answered || 0} of {conversationState?.progress?.total_questions || 0}
          </span>
        </div>
      </div>
    );
  };

  const renderFreeformChat = () => (
    <div className="freeform-chat">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <Bot size={48} />
            <h3>Ask me anything about Dubai properties!</h3>
            <p>I can help with locations, prices, buying process, and more.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-avatar">
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="message assistant-message">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-container">
        <div className="switch-mode-hint">
          <button onClick={startStructuredConversation} className="switch-mode-btn">
            Switch to Guided Search
          </button>
        </div>

        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={freeMessage}
            onChange={(e) => setFreeMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about properties, locations, prices..."
            className="chat-input"
            disabled={isChatLoading}
          />
          <button
            onClick={handleFreeChatSend}
            disabled={!freeMessage.trim() || isChatLoading}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteScreen = () => (
    <div className="completion-screen">
      <div className="completion-icon">
        <CheckCircle size={60} />
      </div>
      <h2>Perfect! We've Got Everything We Need</h2>
      <p>Thank you for providing your requirements. Our property expert will contact you shortly with personalized recommendations.</p>

      {conversationState?.categorization && (
        <div className="categorization-result">
          <div className="lead-score">
            <span className="score-label">Match Score</span>
            <span className="score-value">{conversationState.categorization.lead_score}%</span>
          </div>
          <div className="buyer-type">
            <span className="type-label">Profile</span>
            <span className="type-value">{conversationState.categorization.buyer_type.label}</span>
          </div>
        </div>
      )}

      <div className="completion-actions">
        <button onClick={() => setConversationMode('freeform')} className="action-btn">
          Continue Chatting
        </button>
        <button onClick={() => startStructuredConversation(true)} className="action-btn primary">
          Update Requirements
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navigation />
      <div className="enhanced-chat-page">
        <div className="enhanced-chat-container">
          {conversationMode === 'welcome' && renderWelcomeScreen()}
          {conversationMode === 'structured' && renderStructuredConversation()}
          {conversationMode === 'freeform' && renderFreeformChat()}
          {conversationMode === 'complete' && renderCompleteScreen()}
        </div>
      </div>

      <ScheduleLater
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleSubmit}
        progress={conversationState?.progress || {
          percentage_complete: 0,
          time_elapsed: 0,
          estimated_remaining: 10
        }}
      />
    </>
  );
};

export default EnhancedChat;