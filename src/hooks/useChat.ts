import { useCallback, useEffect } from 'react';
import { useChatStore } from '@store';
import type { ChatSession, Message } from '@types';

export const useChat = () => {
  const {
    sessions,
    currentSessionId,
    isLoading,
    error,
    createSession,
    setCurrentSession,
    sendMessage,
    clearError,
    deleteSession,
    clearAllSessions,
  } = useChatStore();

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      await sendMessage(content);
    },
    [sendMessage]
  );

  const handleCreateSession = useCallback(() => {
    createSession();
  }, [createSession]);

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      deleteSession(sessionId);
    },
    [deleteSession]
  );

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    sessions,
    currentSession,
    messages: currentSession?.messages || [],
    isLoading,
    error,
    sendMessage: handleSendMessage,
    createSession: handleCreateSession,
    setCurrentSession,
    deleteSession: handleDeleteSession,
    clearAllSessions,
    clearError: handleClearError,
  };
};

export type UseChatReturn = ReturnType<typeof useChat>;
