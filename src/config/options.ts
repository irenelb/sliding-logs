import ghii from '@ghii/ghii';
import httpLoader from '@ghii/http-loader';
import packageJsonLoader from '@ghii/package-json-loader';
import yamlLoader from '@ghii/yaml-loader';
import { camelCase } from 'lodash';
import { ConnectOptions } from 'mongoose';
import { PackageJson } from 'type-fest';
import log from './log';

const options = ghii<{
  app: Pick<PackageJson, 'name' | 'version'> & {
    dbName: string;
  };
  apis: { receiver: string };
  slidingLogsInfo: { maxRequest: number; size: number };
  env: 'development' | 'production';
  mongo: { uris: string; options: ConnectOptions };
}>()
  .section('app', {
    defaults: {
      name: 'sliding-logs',
    },
    validator: joi =>
      joi
        .object({
          name: joi.string(),
          dbName: joi.string(),
        })
        .options({ allowUnknown: true }),
  })
  .section('apis', {
    validator: joi =>
      joi.object({
        receiver: joi.string().uri().required(),
      }),
  })
  .section('env', {
    validator: joi => joi.string().allow('development', 'production'),
    defaults: 'production',
  })
  .section('mongo', {
    validator: joi =>
      joi.object({
        uris: joi.string().required(),
        options: joi.object().unknown(),
      }),
  })
  .section('slidingLogsInfo', {
    defaults: { size: 60, maxRequest: 10 },
    validator: j =>
      j.object({
        size: j.number(),
        maxRequest: j.number(),
      }),
  })
  .loader(
    packageJsonLoader({
      target: 'app',
      map: p => ({
        name: p.name,
        version: p.version,
        dbName: camelCase(p.name),
      }),
    })
  )
  .loader(
    yamlLoader(
      {
        throwOnError: process.env.LOADER_THROW !== 'false',
        logger: (err, msg) => {
          log({
            tags: ['yaml-loader'],
          }).info(err, msg);
        },
      },
      ...(process.env.CONFIG_FILE
        ? [process.env.CONFIG_FILE]
        : [process.cwd(), '.sliding-logs.yml'])
    )
  )
  .loader(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    httpLoader(process.env.WELL_KNOWN_URL!, {
      throwOnError: process.env.NODE_ENV !== 'development',
      logger: (err, msg) =>
        log({
          tags: ['http-loader'],
        }).info(err, msg),
    })
  );

export default options;
