import log from '../config/log';

export { log };

const defaultLogger = log({ tags: ['sliding-logs', 'default'] });

export default defaultLogger;
