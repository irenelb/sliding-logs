import irene from './config/Irene';
import log from './config/log';

irene
  .wakeUp()
  .finally(() =>
    log({ tags: ['wakeup', 'application', 'status'] }).info(
      `⚙️  APPLICATION STATUS -> ${irene.mood()}`
    )
  );
