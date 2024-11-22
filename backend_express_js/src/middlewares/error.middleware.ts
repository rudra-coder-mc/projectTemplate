import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// Enhanced error handling middleware
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  console.error(
    `[Error] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  // Differentiate responses for development and production
  if (process.env.NODE_ENV === 'development') {
    // Send detailed error information in development
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: err.stack, // Include stack trace for debugging
    });
  } else {
    // Avoid leaking stack trace details in production
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: statusCode === 500 ? 'Internal Server Error' : message,
    });
  }
};

export default errorHandler;
