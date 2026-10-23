export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly expose: boolean;

  constructor(statusCode: number, code: string, message: string, expose = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.expose = expose;
  }
}

export const errors = {
  validation: (message: string) => new AppError(400, 'VALIDATION_ERROR', message),
  unauthorized: (message = 'Wymagane jest zalogowanie.') =>
    new AppError(401, 'UNAUTHORIZED', message),
  forbidden: (message = 'Brak uprawnień do tej operacji.') =>
    new AppError(403, 'FORBIDDEN', message),
  notFound: (message = 'Nie znaleziono zasobu.') => new AppError(404, 'NOT_FOUND', message),
  conflict: (message: string) => new AppError(409, 'CONFLICT', message),
  invalidCredentials: () =>
    new AppError(401, 'INVALID_CREDENTIALS', 'Nieprawidłowy e-mail lub hasło.'),
  bootstrapUnavailable: () =>
    new AppError(409, 'BOOTSTRAP_UNAVAILABLE', 'Inicjalizacja konta administratora jest niedostępna.'),
};
