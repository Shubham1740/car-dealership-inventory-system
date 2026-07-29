import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose schema validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key errors NOT already caught and translated
  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate value violates a unique constraint',
    });
    return;
  }

  // Malformed ObjectId passed to findById/findByIdAndUpdate/etc.
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // Truly unexpected errors
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};