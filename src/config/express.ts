import compression from 'compression';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { fakeAuthMiddleware } from '../middlewares/fakeAuthMiddleware';

const expressApp =
  /**
   * Create HTTP server.
   */

  express()
    .use(helmet())
    .use(cors())
    .use(compression())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(pinoHttp({}))
    .use(fakeAuthMiddleware);
export default expressApp;
