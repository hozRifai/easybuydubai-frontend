import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useChatStore } from '@store/chatStore';
import { Navigation } from '@components';
import { Send, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import './Chat.css';

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading, error } = useChat();
  const { sessionId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    await sendMessage(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "I'm looking for a villa in Dubai Marina",
    "What's the process for buying property as a foreigner?",
    "Show me properties under 2 million AED",
    "I need help with mortgage options"
  ];

  const handleQuickAction = (action: string) => {
    setMessage(action);
    inputRef.current?.focus();
  };

  return (
    <>
      <Navigation />
      <div className="chat-page">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>EasyBuy<span>Dubai</span></h2>
          </div>

          <nav className="sidebar-nav">
            <a href="#" className="sidebar-link active">
              <MessageSquare size={20} />
              <span>Chat Assistant</span>
            </a>
          </nav>

          <div className="sidebar-info">
            <h3>How can I help?</h3>
            <ul>
              <li>Find your dream property</li>
              <li>Understand the buying process</li>
              <li>Get financing advice</li>
              <li>Learn about areas in Dubai</li>
            </ul>
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
          <div className="header-content">
            <Bot className="header-icon" />
            <div className="header-text">
              <h3>Property Assistant</h3>
              <p>Your personal Dubai real estate expert</p>
            </div>
          </div>
          <div className="header-status">
            <span className="status-indicator"></span>
            <span>Online</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">
                <Sparkles size={48} />
              </div>
              <h2>Welcome to EasyBuy Dubai</h2>
              <p>I'm here to help you find your perfect property in Dubai</p>

              <div className="quick-actions">
                <h4>Quick Start:</h4>
                <div className="action-buttons">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="quick-action-btn"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
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
              {isLoading && (
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
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about properties in Dubai..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>

          <p className="input-hint">
            Press Enter to send • Your conversation is secure and private
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Chat;