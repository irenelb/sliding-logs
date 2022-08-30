import mongoose, { ConnectOptions } from 'mongoose';
import logger from '../config/log';

const log = logger({ tags: ['mongo-db', 'connection'] });
export function awaitConnection(connOptions: {
  uris: string;
  options: ConnectOptions;
}): Promise<void> {
  const { uris, options } = connOptions;
  return new Promise((resolve, reject) => {
    mongoose.connect(uris, options);

    mongoose.connection
      .once('open', function () {
        log.info('✅ MongoDB connected');
        resolve();
      })
      .on('error', function () {
        reject();
        log.error('💥 Unable to connect to MongoDB');
      });
  });
}

export function closeConnection(): Promise<void> {
  return mongoose.disconnect();
}

export function listener(
  message: 'reconnected' | 'disconnected',
  cb: (...args: any[]) => void
): void {
  mongoose.connection.on(message, cb);
}
