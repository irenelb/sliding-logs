import axios from 'axios';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import options from '../config/options';
const RECEIVER_URL = options.snapshot().apis.receiver;
export async function sendFrame(req: Request, res: Response) {
  //send frames to receiver
  const startAt = process.hrtime.bigint();
  const reqId = req.headers['x-request-id'];
  assertReqIdIsAString(reqId);
  const response = await axios.post(RECEIVER_URL, req.body, {
    headers: { 'x-request-id': reqId },
  });
  const endAt = process.hrtime.bigint();
  const diff = Number(endAt - startAt) * 1e-6;

  res.status(httpStatus.OK).json({
    ...response.data,
    responseTimeHeader: response.headers['x-request-time'],
    clientResponseTime: `${diff.toFixed(2)}ms`,
  });
}

function assertReqIdIsAString(
  reqId: string | undefined | string[]
): asserts reqId is string {
  if (!reqId || Array.isArray(reqId)) {
    throw new Error('x-request-id header is not set or invalid');
  }
}
