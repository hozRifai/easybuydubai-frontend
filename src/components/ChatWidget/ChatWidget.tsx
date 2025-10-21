import React, { useState, useRef, useEffect } from 'react';
import { ChatWindow, ChatInput } from '@components';
import { useChat } from '@hooks';
import './ChatWidget.css';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  const { messages, isLoading, sendMessage } = useChat();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && !isOpen) {
      setHasNewMessage(true);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chat-widget-button ${hasNewMessage ? 'has-notification' : ''}`}
        onClick={onToggle}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {hasNewMessage && <span className="notification-dot"></span>}
          </>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          <div className="chat-widget-header-content">
            <div className="chat-widget-avatar">🏠</div>
            <div>
              <h3>Property Assistant</h3>
              <span className="chat-status">Online - Tell me your requirements</span>
            </div>
          </div>
          <button className="chat-widget-minimize" onClick={onToggle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 15l-6-6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="chat-widget-body">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>

        <div className="chat-widget-footer">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </>
  );
};

export default ChatWidget;