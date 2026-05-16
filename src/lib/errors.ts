import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handles API errors gracefully.
 * In production, masks sensitive error messages from the client.
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { 
        error: {
          message: error.message,
          code: error.code
        }
      },
      { status: error.statusCode }
    );
  }

  // Generic production error message
  const isProd = process.env.NODE_ENV === 'production';
  return NextResponse.json(
    { 
      error: {
        message: isProd ? 'An unexpected error occurred. Please try again later.' : String(error),
        code: 'INTERNAL_SERVER_ERROR'
      }
    },
    { status: 500 }
  );
}

/**
 * Common security error responses
 */
export const SecurityErrors = {
  unauthorized: (message = 'Unauthorized access') => new AppError(message, 401, 'UNAUTHORIZED'),
  forbidden: (message = 'Permission denied') => new AppError(message, 403, 'FORBIDDEN'),
  tooManyRequests: (message = 'Too many requests. Please try again later.') => new AppError(message, 429, 'RATE_LIMIT_EXCEEDED'),
  invalidInput: (message = 'Invalid input data') => new AppError(message, 400, 'BAD_REQUEST'),
};
