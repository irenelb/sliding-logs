import { Request, Response } from 'express';
import httpStatus from 'http-status';
import log from '../config/log';
import ErrorResponse from '../util/ErrorResponse';

export type CriticalValue = 'on' | 'off';
export type CriticalCondition = {
  critical: (newValue?: CriticalValue) => boolean;
  criticalConditionMiddleware: (
    req: Request,
    res: Response,
    next: (err?: Error | undefined) => void
  ) => void;
};

export function criticalConditionMiddleware(): CriticalCondition {
  let isCritical = false;
  function critical(newValue?: CriticalValue) {
    switch (newValue) {
      case 'on':
        isCritical = true;
        break;

      case 'off':
        isCritical = false;
        break;
    }
    return isCritical;
  }

  function middleware(
    req: Request,
    res: Response,
    next: (err?: Error) => void
  ): void {
    if (isCritical) {
      log({
        xRequest: req.headers['x-request-id'] as string,
        tags: ['critical-condition'],
      }).error(
        { url: req.url },
        '🚨 TERMINATING REQUEST, application in is in CRITICAL STATE MODE'
      );
      next(
        new ErrorResponse(
          httpStatus.SERVICE_UNAVAILABLE,
          'Server is unable to complete requests'
        )
      );
    }
    next();
  }
  return { critical, criticalConditionMiddleware: middleware };
}
export default criticalConditionMiddleware();
