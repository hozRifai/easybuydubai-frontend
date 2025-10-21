import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../ChatMessage';
import { Loader2 } from 'lucide-react';
import type { Message } from '@types';
import './ChatWindow.css';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h2>Welcome to EasyBuy Dubai</h2>
          <p>Start a conversation by typing a message below</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="loading-indicator">
              <Loader2 className="spinner" size={24} />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};
