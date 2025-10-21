import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format timestamp for chat messages
 */
export const formatMessageTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }
  return format(date, 'MMM dd, HH:mm');
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validate message content
 */
export const isValidMessage = (message: string, maxLength: number): boolean => {
  return message.trim().length > 0 && message.length <= maxLength;
};
