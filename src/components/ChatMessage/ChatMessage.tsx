import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertCircle } from 'lucide-react';
import { formatMessageTime } from '@utils';
import type { Message } from '@types';
import { config } from '@config';
import './ChatMessage.css';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="message-content-wrapper">
        <div className="message-header">
          <span className="message-role">{isUser ? 'You' : 'Assistant'}</span>
          <span className="message-time">{formatMessageTime(message.timestamp)}</span>
        </div>
        <div className="message-content">
          {config.features.enableMarkdown && !isUser ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        {isError && message.error && (
          <div className="message-error">
            <AlertCircle size={16} />
            <span>{message.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
