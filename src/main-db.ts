import { awaitConnection, closeConnection } from './config/mongodb';
import opts from './config/options';
import ConnectionTestMongo from './modules/models/ConnectionTestDocument';
import log from './config/log';

async function start(): Promise<void> {
  try {
    await awaitConnection(opts.snapshot().mongo);
  } catch (err) {
    log({ tags: ['mongo', 'error'] }).debug('💥 ops', err);
    throw err;
  }
}

async function stop(): Promise<void> {
  await closeConnection();
}

async function checkDb(): Promise<void> {
  log({ tags: ['mongo', 'read-write'] }).info('⏳ check mongo connection');

  const { _id } = await new ConnectionTestMongo({
    options: opts.snapshot().mongo.options,
  }).save();
  const result = await ConnectionTestMongo.findOneAndDelete({ _id });
  if (!result) {
    throw new Error('Expected object with _id ' + _id + ' not found');
  }
}

export { checkDb, start, stop };
