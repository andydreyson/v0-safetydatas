/**
 * SafetyDatas Logging Utility
 * Structured logging with severity levels and environment-aware output
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  requestId?: string;
  userId?: string;
}

class Logger {
  private static instance: Logger;
  private isProduction: boolean;
  private minLevel: LogLevel;

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || (this.isProduction ? 'info' : 'debug');
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private formatLogEntry(entry: LogEntry): string {
    if (this.isProduction) {
      // JSON format for production (easier to parse in log aggregators)
      return JSON.stringify(entry);
    }

    // Pretty format for development
    const colorMap: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    const color = colorMap[entry.level];
    
    let output = `${color}[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${reset}`;
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    if (entry.error) {
      output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack && !this.isProduction) {
        output += `\n  Stack: ${entry.error.stack}`;
      }
    }

    return output;
  }

  private createEntry(
    level: LogLevel,
    message: string,
    options?: {
      context?: LogContext;
      error?: Error;
      requestId?: string;
      userId?: string;
    }
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };

    if (options?.context) {
      entry.context = options.context;
    }

    if (options?.error) {
      entry.error = {
        name: options.error.name,
        message: options.error.message,
        stack: this.isProduction ? undefined : options.error.stack
      };
    }

    if (options?.requestId) {
      entry.requestId = options.requestId;
    }

    if (options?.userId) {
      entry.userId = options.userId;
    }

    return entry;
  }

  debug(message: string, context?: LogContext, requestId?: string): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createEntry('debug', message, { context, requestId });
    console.debug(this.formatLogEntry(entry));
  }

  info(message: string, context?: LogContext, requestId?: string): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createEntry('info', message, { context, requestId });
    console.info(this.formatLogEntry(entry));
  }

  warn(message: string, context?: LogContext, requestId?: string): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createEntry('warn', message, { context, requestId });
    console.warn(this.formatLogEntry(entry));
  }

  error(message: string, error?: Error, context?: LogContext, requestId?: string): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createEntry('error', message, { error, context, requestId });
    console.error(this.formatLogEntry(entry));

    // In production, you might want to send to an error tracking service
    if (this.isProduction) {
      this.sendToErrorTracking(entry);
    }
  }

  /**
   * Log an API request
   */
  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    requestId?: string,
    userId?: string
  ): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(
      level,
      `${method} ${path} ${statusCode} ${duration}ms`,
      {
        requestId,
        userId,
        context: {
          method,
          path,
          statusCode,
          durationMs: duration
        }
      }
    );

    console.log(this.formatLogEntry(entry));
  }

  /**
   * Log a database operation
   */
  logDatabase(
    operation: string,
    table: string,
    duration: number,
    success: boolean,
    requestId?: string
  ): void {
    const level: LogLevel = success ? 'debug' : 'error';
    
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(
      level,
      `DB ${operation} on ${table} ${success ? 'succeeded' : 'failed'} in ${duration}ms`,
      {
        requestId,
        context: {
          operation,
          table,
          durationMs: duration,
          success
        }
      }
    );

    console.log(this.formatLogEntry(entry));
  }

  /**
   * Create a child logger with bound context
   */
  child(defaultContext: LogContext): Logger {
    const childLogger = new Logger();
    const originalCreateEntry = childLogger.createEntry.bind(childLogger);
    
    childLogger.createEntry = (
      level: LogLevel,
      message: string,
      options?: Parameters<typeof this.createEntry>[2]
    ) => {
      const entry = originalCreateEntry(level, message, options);
      entry.context = { ...defaultContext, ...entry.context };
      return entry;
    };
    
    return childLogger;
  }

  private sendToErrorTracking(entry: LogEntry): void {
    // Integrate with error tracking services like Sentry
    // This is a placeholder - implement based on your monitoring solution
    
    if (process.env.SENTRY_DSN && entry.level === 'error') {
      // Import Sentry dynamically to avoid loading in non-production
      import('@sentry/nextjs').then(Sentry => {
        if (entry.error) {
          const error = new Error(entry.error.message);
          error.name = entry.error.name;
          error.stack = entry.error.stack;
          Sentry.captureException(error, {
            extra: entry.context,
            tags: {
              requestId: entry.requestId
            }
          });
        } else {
          Sentry.captureMessage(entry.message, entry.level as any);
        }
      }).catch(() => {
        // Sentry not available, silently fail
      });
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export class for testing
export { Logger };
