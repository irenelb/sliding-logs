import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../util/ErrorResponse';

type FakeUid = {
  subject: string;
};
declare module 'http' {
  interface IncomingMessage {
    uid: FakeUid;
  }
}

export function fakeAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sub = req.headers['x-uid-sub'];
  if (!sub) {
    next(new ErrorResponse(httpStatus.BAD_REQUEST, 'missing x-uid-sub header'));
    return;
  }
  req.uid = { subject: sub as string };
  next();
}
