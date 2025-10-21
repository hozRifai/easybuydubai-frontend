import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { config } from '@config';
import './Header.css';

interface HeaderProps {
  onClearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <MessageSquare size={28} />
          <h1 className="header-title">{config.app.name}</h1>
        </div>
        {onClearChat && (
          <button className="clear-button" onClick={onClearChat} aria-label="Clear chat">
            <Trash2 size={20} />
            <span>Clear Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};
