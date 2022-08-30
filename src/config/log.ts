import { pick } from 'lodash';
import { nanoid } from 'nanoid';
import pino from 'pino';
import opts from './options';
export type LEVELS = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

const options: pino.LoggerOptions | pino.DestinationStream = {
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.PRETTY_PRINT === 'true' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
};

function log({
  tags = [],
  xRequest,
  idRef,
}: {
  tags?: string[];
  xRequest?: string;
  idRef?: string;
}) {
  return pino({
    ...options,
    base: {
      ...pick(opts?.snapshot(), 'app'),
      tags,
      'x-request': xRequest ?? nanoid(),
      'id-ref': idRef,
    },
  });
}

export { log };
export default log;
