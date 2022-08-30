import { Response, Request, NextFunction } from 'express';
import httpStatus from 'http-status';
import opts from '../config/options';
import ErrorResponse from '../util/ErrorResponse';
import log from '../config/log';

const IS_DEVELOPMENT = opts.snapshot().env === 'development';
export function errorResponseMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { statusCode, error } =
    err instanceof ErrorResponse
      ? { statusCode: err.statusCode, error: err.error }
      : { statusCode: httpStatus.INTERNAL_SERVER_ERROR, error: undefined };

  res.status(statusCode).json({
    message: err.message,
    stack: IS_DEVELOPMENT ? err.stack : undefined,
    error: IS_DEVELOPMENT ? error : undefined,
  });
  log({
    xRequest: req.headers['x-request-id'] as string,
    tags: ['error-response'],
  }).error(err);
  next();
  return;
}

export function defaultMiddleware(
  req: Request,
  res: Response,
  next: (err?: Error) => void
): void {
  next(new ErrorResponse(httpStatus.NOT_FOUND, 'not found'));
}

export function mongoErrorMiddleware(
  err: Error & { code: number },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.name !== 'MongoError') return next(err);
  switch (err.code) {
    case 11000:
      return next(new ErrorResponse(httpStatus.CONFLICT, err.message));
    default:
      return next(err);
  }
}
