/**
 * SafetyDatas Error Handler
 * Centralized error handling with categorization and user-friendly messages
 */

import { logger } from './logger';
import { NextResponse } from 'next/server';

export type ErrorCategory = 
  | 'database'
  | 'auth'
  | 'validation'
  | 'stripe'
  | 'openai'
  | 'file_upload'
  | 'network'
  | 'configuration'
  | 'unknown';

export interface AppError extends Error {
  category: ErrorCategory;
  code: string;
  statusCode: number;
  isOperational: boolean;
  context?: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    category: ErrorCategory;
  };
  requestId: string;
  timestamp: string;
}

class ErrorHandler {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || this.generateRequestId();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new application error
   */
  createError(
    message: string,
    category: ErrorCategory,
    code: string,
    statusCode: number = 500,
    context?: Record<string, unknown>
  ): AppError {
    const error = new Error(message) as AppError;
    error.category = category;
    error.code = code;
    error.statusCode = statusCode;
    error.isOperational = true;
    error.context = context;
    
    return error;
  }

  /**
   * Handle database errors
   */
  handleDatabaseError(error: unknown, operation?: string): AppError {
    const message = error instanceof Error ? error.message : 'Database operation failed';
    
    let code = 'DB_ERROR';
    let statusCode = 500;
    
    // Parse common Prisma errors
    if (message.includes('P2002')) {
      code = 'DB_UNIQUE_CONSTRAINT';
      statusCode = 409;
    } else if (message.includes('P2025')) {
      code = 'DB_RECORD_NOT_FOUND';
      statusCode = 404;
    } else if (message.includes('P2003')) {
      code = 'DB_FOREIGN_KEY_CONSTRAINT';
      statusCode = 400;
    } else if (message.includes('connection')) {
      code = 'DB_CONNECTION_ERROR';
      statusCode = 503;
    }

    return this.createError(
      message,
      'database',
      code,
      statusCode,
      { originalError: error, operation }
    );
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error: unknown, type: 'unauthorized' | 'forbidden' | 'session_expired'): AppError {
    const messages = {
      unauthorized: 'Authentication required',
      forbidden: 'Access denied',
      session_expired: 'Session expired, please log in again'
    };

    const codes = {
      unauthorized: 'AUTH_REQUIRED',
      forbidden: 'AUTH_FORBIDDEN',
      session_expired: 'AUTH_SESSION_EXPIRED'
    };

    const statusCodes = {
      unauthorized: 401,
      forbidden: 403,
      session_expired: 401
    };

    return this.createError(
      messages[type],
      'auth',
      codes[type],
      statusCodes[type],
      { originalError: error, authType: type }
    );
  }

  /**
   * Handle Stripe errors
   */
  handleStripeError(error: unknown): AppError {
    let message = 'Payment processing failed';
    let code = 'STRIPE_ERROR';
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;
      
      if (message.includes('card_declined')) {
        code = 'STRIPE_CARD_DECLINED';
        statusCode = 400;
        message = 'Your card was declined. Please try a different payment method.';
      } else if (message.includes('insufficient_funds')) {
        code = 'STRIPE_INSUFFICIENT_FUNDS';
        statusCode = 400;
        message = 'Insufficient funds. Please try a different payment method.';
      } else if (message.includes('expired_card')) {
        code = 'STRIPE_EXPIRED_CARD';
        statusCode = 400;
        message = 'Your card has expired. Please try a different payment method.';
      } else if (message.includes('incorrect_number')) {
        code = 'STRIPE_INCORRECT_NUMBER';
        statusCode = 400;
        message = 'Your card number is incorrect. Please check and try again.';
      }
    }

    return this.createError(message, 'stripe', code, statusCode, { originalError: error });
  }

  /**
   * Handle OpenAI errors
   */
  handleOpenAIError(error: unknown): AppError {
    let message = 'AI analysis failed';
    let code = 'OPENAI_ERROR';
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;
      
      if (message.includes('rate limit')) {
        code = 'OPENAI_RATE_LIMIT';
        statusCode = 429;
        message = 'AI service is temporarily busy. Please try again in a moment.';
      } else if (message.includes('context length')) {
        code = 'OPENAI_CONTEXT_LENGTH';
        statusCode = 413;
        message = 'Document is too large for analysis. Please try a smaller file.';
      } else if (message.includes('invalid_api_key')) {
        code = 'OPENAI_AUTH_ERROR';
        statusCode = 500;
        message = 'AI service configuration error. Please contact support.';
      }
    }

    return this.createError(message, 'openai', code, statusCode, { originalError: error });
  }

  /**
   * Handle file upload errors
   */
  handleUploadError(error: unknown): AppError {
    let message = 'File upload failed';
    let code = 'UPLOAD_ERROR';
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;
      
      if (message.includes('too large') || message.includes('size')) {
        code = 'UPLOAD_FILE_TOO_LARGE';
        statusCode = 413;
        message = 'File is too large. Maximum file size is 50MB.';
      } else if (message.includes('type') || message.includes('format')) {
        code = 'UPLOAD_INVALID_TYPE';
        statusCode = 415;
        message = 'Invalid file type. Please upload PDF, PNG, or JPEG files only.';
      }
    }

    return this.createError(message, 'file_upload', code, statusCode, { originalError: error });
  }

  /**
   * Handle validation errors
   */
  handleValidationError(message: string, field?: string): AppError {
    return this.createError(
      message,
      'validation',
      'VALIDATION_ERROR',
      400,
      { field }
    );
  }

  /**
   * Log error and return API response
   */
  handle(error: unknown, context?: Record<string, unknown>): NextResponse<ErrorResponse> {
    const appError = this.normalizeError(error);
    
    // Log the error
    logger.error(
      appError.message,
      appError,
      { 
        ...appError.context,
        ...context,
        category: appError.category,
        code: appError.code
      },
      this.requestId
    );

    // Build user-friendly response
    const response: ErrorResponse = {
      success: false,
      error: {
        code: appError.code,
        message: this.sanitizeMessage(appError),
        category: appError.category
      },
      requestId: this.requestId,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: appError.statusCode });
  }

  /**
   * Convert any error to AppError
   */
  private normalizeError(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return this.createError(
        error.message,
        'unknown',
        'UNKNOWN_ERROR',
        500,
        { originalError: error }
      );
    }

    return this.createError(
      'An unexpected error occurred',
      'unknown',
      'UNKNOWN_ERROR',
      500,
      { originalError: error }
    );
  }

  /**
   * Check if error is already an AppError
   */
  private isAppError(error: unknown): error is AppError {
    return error instanceof Error && 'category' in error && 'code' in error;
  }

  /**
   * Sanitize error message for client (don't expose internal details in production)
   */
  private sanitizeMessage(error: AppError): string {
    // In production, hide internal details for non-operational errors
    if (process.env.NODE_ENV === 'production' && !error.isOperational) {
      return 'An unexpected error occurred. Please try again or contact support.';
    }

    return error.message;
  }

  /**
   * Get request ID for correlation
   */
  getRequestId(): string {
    return this.requestId;
  }
}

// Helper function to create error handler for a request
export function createErrorHandler(requestId?: string): ErrorHandler {
  return new ErrorHandler(requestId);
}

// Export common error creators
export const Errors = {
  database: (message: string, context?: Record<string, unknown>) =>
    createErrorHandler().createError(message, 'database', 'DB_ERROR', 500, context),
  
  auth: {
    unauthorized: (message = 'Authentication required') =>
      createErrorHandler().createError(message, 'auth', 'AUTH_REQUIRED', 401),
    forbidden: (message = 'Access denied') =>
      createErrorHandler().createError(message, 'auth', 'AUTH_FORBIDDEN', 403),
    sessionExpired: (message = 'Session expired') =>
      createErrorHandler().createError(message, 'auth', 'AUTH_SESSION_EXPIRED', 401)
  },
  
  validation: (message: string, field?: string) =>
    createErrorHandler().createError(message, 'validation', 'VALIDATION_ERROR', 400, { field }),
  
  stripe: (message = 'Payment processing failed') =>
    createErrorHandler().createError(message, 'stripe', 'STRIPE_ERROR', 500),
  
  openai: (message = 'AI analysis failed') =>
    createErrorHandler().createError(message, 'openai', 'OPENAI_ERROR', 500),
  
  upload: (message = 'File upload failed') =>
    createErrorHandler().createError(message, 'file_upload', 'UPLOAD_ERROR', 500),
  
  notFound: (resource: string) =>
    createErrorHandler().createError(`${resource} not found`, 'database', 'NOT_FOUND', 404)
};
