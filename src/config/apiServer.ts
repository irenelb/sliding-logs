import ApiServer from '../util/ApiServer';
import { criticalConditionMiddleware } from '../mount-point/criticalCondition';
import {
  defaultMiddleware,
  mongoErrorMiddleware,
  errorResponseMiddleware,
} from '../middlewares/errorsMiddleware';
import app from './express';
import appRouter from './routes';
import {
  traceUserReq,
  windowBearer,
} from '../middlewares/traceUserReqMiddleware';

const apiServer = new ApiServer({
  requestListener: app,
  port: process.env.PORT,
});
app.use(traceUserReq);
app.use(criticalConditionMiddleware);
app.use(windowBearer);
app.use(appRouter);
app.use(defaultMiddleware);
app.use(mongoErrorMiddleware);
app.use(errorResponseMiddleware);

export default apiServer;
