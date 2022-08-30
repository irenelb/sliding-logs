import waitOn from 'wait-on';
import apiServer from './config/apiServer';
import log from './config/log';

export async function start(): Promise<void> {
  try {
    await apiServer.start();
  } catch (err) {
    log({ tags: ['server'] }).debug('💥 ops', err);
    throw err;
  }
}

export async function stop(): Promise<void> {
  await apiServer.stop();
}
export async function engineCheck(options: {
  waitOpts?: waitOn.WaitOnOptions;
  envs?: { [name: string]: string };
}): Promise<void> {
  try {
    const { waitOpts, envs = process.env } = options;
    if (envs.ENV !== 'DEVELOPMENT' && waitOpts) await waitOn(waitOpts);
  } catch (err) {
    if (err instanceof Error) {
      log({ tags: ['engine-check'] }).error(err);
      throw err;
    }
  }
}

export default {
  start,
  stop,
  engineCheck,
};
