import './util/configs';
import options from './config/options';
import log from './config/log';

(async () => {
  const logger = log({
    tags: ['ghii-snapshot'],
  });

  try {
    await options.waitForFirstSnapshot({ timeout: 10000 }, __dirname, './main');
    logger.debug({ options: options.snapshot() }, 'CONFIG-SNAPSHOT - OK');
  } catch (err) {
    logger.error(err, 'CONFIG-SNAPSHOT - KO');
  }
})();
