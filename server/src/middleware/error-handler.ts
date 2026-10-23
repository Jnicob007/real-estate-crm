import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/errors.js';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? 'Niepoprawne dane wejściowe.';
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  logger.error('Nieobsłużony błąd serwera', {
    name: error instanceof Error ? error.name : 'unknown',
    message: error instanceof Error ? error.message : 'unknown',
  });

  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Wystąpił nieoczekiwany błąd.' },
  });
}
