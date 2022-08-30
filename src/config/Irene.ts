import { IreneKills } from '@iad-os/irene-kills';
import log from '../config/log';
import * as mongoService from '../main-db';
import * as apiService from '../main-http';
import { critical } from '../mount-point/criticalCondition';
import * as mongo from './mongodb';
import options from './options';

const irene = new IreneKills();

irene.resource('mongo', {
  need: async () => {
    log({ tags: ['init-mongo'] }).info('⏳ initialize mongo connection');
    await mongoService.start();
  },
  check: async () => {
    try {
      await mongoService.checkDb();
      log({ tags: ['mongo', 'check'] }).info('✅ OK check mongo connection');
      return true;
    } catch (err) {
      log({ tags: ['mongo', 'check', 'error'] }).error(
        { error: err },
        '💥 KO check mongo connection'
      );
      return false;
    }
  },

  on: {
    healthcheck: async () => {
      try {
        await mongoService.checkDb();

        return { healthy: true, kill: false };
      } catch (error) {
        return { healthy: false };
      }
    },
  },
});

irene.resource('http', {
  activate: async () => {
    try {
      await apiService.start();
      log({ tags: ['server'] }).info('✅ Application started');
      return { kill: false, healthy: true };
    } catch (err) {
      return { kill: true, healthy: false };
    }
  },
});

irene.resource('appCondition', {
  need: () => {
    mongo.listener('disconnected', () => {
      irene.healthcheck();
      critical('on');
    });
    mongo.listener('reconnected', () => {
      irene.healthcheck();
      critical('off');
    });
  },
});

export default irene;
