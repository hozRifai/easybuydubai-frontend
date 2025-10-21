import axios, { AxiosInstance } from 'axios';
import { config } from '@config';

export interface TimelineCategory {
  id: string;
  name: string;
  icon: string;
  status: 'completed' | 'active' | 'skipped' | 'upcoming';
  is_optional: boolean;
}

export interface Progress {
  current_category: string;
  current_category_name: string;
  categories_completed: number;
  total_categories: number;
  questions_answered: number;
  total_questions: number;
  percentage_complete: number;
  time_elapsed: number;
  estimated_remaining: number;
  skipped_categories: string[];
}

export interface Question {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text_input' | 'range';
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  has_other: boolean;
  other_prompt?: string;
  is_optional: boolean;
}

export interface ConversationState {
  session_id: string;
  status: 'started' | 'in_progress' | 'complete' | 'scheduled';
  question?: Question;
  next_question?: Question;
  timeline: TimelineCategory[];
  progress: Progress;
  summary?: any;
  categorization?: any;
  responses?: any; // Existing responses for pre-population
}

export interface AnswerRequest {
  session_id: string;
  question_id: string;
  answer: any;
  is_other: boolean;
  other_text?: string;
}

export interface ScheduleRequest {
  session_id: string;
  phone_number: string;
  preferred_time: string;
  contact_method: string;
}

class ConversationService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Start a new conversation flow
   */
  async startConversation(sessionId: string): Promise<ConversationState> {
    const response = await this.client.post('/api/conversation/start', null, {
      params: { session_id: sessionId }
    });
    return response.data;
  }

  /**
   * Get current question in the flow
   */
  async getCurrentQuestion(sessionId: string): Promise<ConversationState> {
    const response = await this.client.get(`/api/conversation/question/${sessionId}`);
    return response.data;
  }

  /**
   * Submit an answer to the current question
   */
  async submitAnswer(request: AnswerRequest): Promise<ConversationState> {
    const response = await this.client.post('/api/conversation/answer', request);
    return response.data;
  }

  /**
   * Add additional note for a category
   */
  async addCategoryNote(sessionId: string, categoryId: string, note: string): Promise<void> {
    await this.client.post('/api/conversation/category-note', {
      session_id: sessionId,
      category_id: categoryId,
      note: note
    });
  }

  /**
   * Skip a category
   */
  async skipCategory(sessionId: string, categoryId: string): Promise<ConversationState> {
    const response = await this.client.post(
      `/api/conversation/skip-category/${sessionId}/${categoryId}`
    );
    return response.data;
  }

  /**
   * Get timeline status
   */
  async getTimelineStatus(sessionId: string): Promise<{
    timeline: TimelineCategory[];
    progress: Progress;
  }> {
    const response = await this.client.get(`/api/conversation/timeline/${sessionId}`);
    return response.data;
  }

  /**
   * Schedule conversation for later
   */
  async scheduleForLater(request: ScheduleRequest): Promise<any> {
    const response = await this.client.post('/api/conversation/schedule-later', request);
    return response.data;
  }

  /**
   * Get conversation summary
   */
  async getSummary(sessionId: string): Promise<any> {
    const response = await this.client.get(`/api/conversation/summary/${sessionId}`);
    return response.data;
  }
}

export const conversationService = new ConversationService();