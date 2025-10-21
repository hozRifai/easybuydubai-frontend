import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { config } from '@config';
import { isValidMessage } from '@utils';
import './ChatInput.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (!isValidMessage(message, config.features.maxMessageLength) || disabled) {
      return;
    }

    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOverLimit = message.length > config.features.maxMessageLength;
  const charsRemaining = config.features.maxMessageLength - message.length;

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSubmit}
          disabled={disabled || !message.trim() || isOverLimit}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
      <div className="chat-input-footer">
        <span className={`char-counter ${isOverLimit ? 'over-limit' : ''}`}>
          {isOverLimit ? `${-charsRemaining} over limit` : `${charsRemaining} characters remaining`}
        </span>
        <span className="hint">Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
};
