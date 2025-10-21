import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatSession, Message, ChatState } from '@types';
import { generateId } from '@utils';
import { apiService } from '@services';
import { config } from '@config';

interface ChatActions {
  createSession: () => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
}

const createNewSession = (): ChatSession => ({
  id: generateId(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      // State
      sessions: [createNewSession()],
      currentSessionId: null,
      isLoading: false,
      error: null,

      // Actions
      createSession: () => {
        const newSession = createNewSession();
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        }));
      },

      setCurrentSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },

      addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: new Date(),
                  // Update title based on first user message
                  title:
                    session.messages.length === 0 && message.role === 'user'
                      ? message.content.slice(0, 50)
                      : session.title,
                }
              : session
          ),
        }));
      },

      updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      sendMessage: async (content: string) => {
        const state = get();
        let sessionId = state.currentSessionId;

        // Create a new session if none exists
        if (!sessionId) {
          const newSession = createNewSession();
          set((state) => ({
            sessions: [...state.sessions, newSession],
            currentSessionId: newSession.id,
          }));
          sessionId = newSession.id;
        }

        // Add user message
        const userMessageId = generateId();
        const userMessage: Message = {
          id: userMessageId,
          role: 'user',
          content,
          timestamp: new Date(),
          status: 'sending',
        };

        get().addMessage(sessionId, userMessage);

        // Add temporary assistant message
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          status: 'sending',
        };

        get().addMessage(sessionId, assistantMessage);

        set({ isLoading: true, error: null });

        try {
          // Send message to API
          const response = await apiService.sendMessage({
            message: content,
            sessionId,
          });

          // Update user message status
          get().updateMessage(sessionId, userMessageId, { status: 'sent' });

          // Update assistant message with response
          get().updateMessage(sessionId, assistantMessageId, {
            content: response.message,
            status: 'sent',
          });

          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

          // Update user message with error
          get().updateMessage(sessionId, userMessageId, {
            status: 'error',
            error: errorMessage,
          });

          // Remove the temporary assistant message
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: session.messages.filter((msg) => msg.id !== assistantMessageId),
                  }
                : session
            ),
            isLoading: false,
            error: errorMessage,
          }));
        }
      },

      clearError: () => {
        set({ error: null });
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== sessionId);
          const newCurrentSessionId =
            state.currentSessionId === sessionId
              ? newSessions[0]?.id || null
              : state.currentSessionId;

          return {
            sessions: newSessions.length > 0 ? newSessions : [createNewSession()],
            currentSessionId: newCurrentSessionId,
          };
        });
      },

      clearAllSessions: () => {
        const newSession = createNewSession();
        set({
          sessions: [newSession],
          currentSessionId: newSession.id,
          error: null,
        });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) =>
        config.features.enableSessionPersistence
          ? { sessions: state.sessions, currentSessionId: state.currentSessionId }
          : {},
    }
  )
);
