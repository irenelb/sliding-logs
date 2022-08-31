import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { checkUserWindow, newReqPerUser } from '../util/slidingLogs';

export function traceUserReq(req: Request, res: Response, next: NextFunction) {
  newReqPerUser(req.uid.subject, { id: '', timestamp: new Date() });
  next();
}

export function windowBearer(req: Request, res: Response, next: NextFunction) {
  const check = checkUserWindow(req.uid.subject);
  if (check) {
    res.status(httpStatus.TOO_MANY_REQUESTS).json({ error: 'retry' });
    return;
  }
  next();
}
