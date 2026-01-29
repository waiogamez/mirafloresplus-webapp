/**
 * Logger System - Miraflores Plus
 * 
 * Structured logging for development and debugging
 */

import { isDevelopment } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  source?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabledLevels: Set<LogLevel> = new Set(['info', 'warn', 'error']);
  private isDevelopment: boolean;

  constructor() {
    // Check for development mode safely
    this.isDevelopment = isDevelopment();
    
    // In development, enable all levels
    if (this.isDevelopment) {
      this.enabledLevels.add('debug');
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, any>, source?: string) {
    this.log('debug', message, context, source);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>, source?: string) {
    this.log('info', message, context, source);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, any>, source?: string) {
    this.log('warn', message, context, source);
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, any>, source?: string) {
    this.log('error', message, context, source);
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    source?: string
  ) {
    if (!this.enabledLevels.has(level)) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      source,
    };

    this.logs.push(entry);

    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (this.isDevelopment) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      const prefix = `${emoji} [${level.toUpperCase()}]${source ? ` [${source}]` : ''}`;

      switch (level) {
        case 'debug':
          console.debug(prefix, message, context || '');
          break;
        case 'info':
          console.info(prefix, message, context || '');
          break;
        case 'warn':
          console.warn(prefix, message, context || '');
          break;
        case 'error':
          console.error(prefix, message, context || '');
          break;
      }
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs by source
   */
  getLogsBySource(source: string): LogEntry[] {
    return this.logs.filter((log) => log.source === source);
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Enable log level
   */
  enableLevel(level: LogLevel) {
    this.enabledLevels.add(level);
  }

  /**
   * Disable log level
   */
  disableLevel(level: LogLevel) {
    this.enabledLevels.delete(level);
  }

  /**
   * Get log counts
   */
  getLogCounts() {
    return {
      total: this.logs.length,
      debug: this.logs.filter((l) => l.level === 'debug').length,
      info: this.logs.filter((l) => l.level === 'info').length,
      warn: this.logs.filter((l) => l.level === 'warn').length,
      error: this.logs.filter((l) => l.level === 'error').length,
    };
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const json = this.exportLogs();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `miraflores-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(source: string) {
  return {
    debug: (message: string, context?: Record<string, any>) =>
      logger.debug(message, context, source),
    info: (message: string, context?: Record<string, any>) =>
      logger.info(message, context, source),
    warn: (message: string, context?: Record<string, any>) =>
      logger.warn(message, context, source),
    error: (message: string, context?: Record<string, any>) =>
      logger.error(message, context, source),
  };
}

/**
 * Performance logging helper
 */
export function logPerformance(label: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  logger.debug(`Performance: ${label}`, {
    duration: `${(end - start).toFixed(2)}ms`,
  });
}

/**
 * Async performance logging helper
 */
export async function logAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    logger.debug(`Performance: ${label}`, {
      duration: `${(end - start).toFixed(2)}ms`,
      status: 'success',
    });
    return result;
  } catch (error) {
    const end = performance.now();
    logger.error(`Performance: ${label}`, {
      duration: `${(end - start).toFixed(2)}ms`,
      status: 'error',
      error: (error as Error).message,
    });
    throw error;
  }
}
