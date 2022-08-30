import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import { EventEmitter } from 'events';
import http, { RequestListener, Server, ServerOptions } from 'http';
import { isNumber } from 'lodash';
import irene from '../config/Irene';
import log from '../config/log';

export type ServerConfigs = {
  requestListener: RequestListener;
  serverOptions?: ServerOptions;
  port?: number | string;
  delayShutdown?: number;
};

export default class ApiServer extends EventEmitter {
  server: Server;
  private port: number;
  constructor(private configs: ServerConfigs) {
    super();
    const {
      serverOptions = {},
      requestListener,
      port,
      delayShutdown = 0,
    } = configs;
    this.port = normalizePort(port);
    this.server = http.createServer(serverOptions, requestListener);
    connectTerminus(this.server, {
      onSignal: async () => this.emit('signal'),
      onShutdown: async () => this.emit('shutdown'),
      beforeShutdown() {
        // given your readiness probes run every 5 second
        // may be worth using a bigger number so you won't
        // run into any race conditions
        return new Promise(resolve => {
          delayShutdown ? setTimeout(resolve, delayShutdown) : resolve({});
        });
      },
    });
    bindDefaultListener(this);
  }

  async start(): Promise<void> {
    this.server.listen(this.port);
  }
  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server.listening) {
        this.server.close(err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  get listeningPort(): number {
    return this.port;
  }
  get requestListener(): RequestListener {
    return this.configs.requestListener;
  }
}
/**
 * Normalize a port into a number, string, or false.
 */
export function normalizePort(portValue?: string | number): number {
  if (!portValue) {
    return 3000;
  }

  const portTest = isNumber(portValue) ? portValue : parseInt(portValue, 10);

  if (portTest >= 0 && portTest <= 65535) {
    // port number
    return portTest;
  }

  throw new Error(`TCP Port is not valid ${portValue}`);
}
export async function onHealthCheck(): Promise<void> {
  const hcInfos = await irene.healthcheck();
  log({ tags: ['api-server', 'health-check', 'app-status'] }).info(
    `⚙️  APPLICATION HEALTH -> ${JSON.stringify(hcInfos)}`
  );
  if (!hcInfos.healthy) {
    throw new Error(JSON.stringify(hcInfos));
  }
}

export function connectTerminus(
  server: http.Server,
  eventsHandlers: {
    onSignal?: () => Promise<unknown>;
    onShutdown?: () => Promise<unknown>;
    beforeShutdown?: () => Promise<unknown>;
  }
): void {
  const { onSignal, onShutdown, beforeShutdown } = eventsHandlers;
  const logger = log({ tags: ['api-server', 'terminus'] });
  const terminusOptions: TerminusOptions = {
    // health check options
    healthChecks: {
      '/healthcheck': onHealthCheck,
      verbatim: true,
    },

    // cleanup options
    timeout: 1000,

    // signal, // [optional = 'SIGTERM'] what signal to listen for relative to shutdown
    // signals, // [optional = []] array of signals to listen for relative to shutdown
    // beforeShutdown, // [optional] called before the HTTP server starts its shutdown
    beforeShutdown,
    onSignal,
    onShutdown,

    // onSendFailureDuringShutdown, // [optional] called before sending each 503 during shutdowns
    // both
    logger: logger.trace.bind(logger),
  };

  createTerminus(server, terminusOptions);
}

export function bindDefaultListener({
  listeningPort,
  server,
}: ApiServer): void {
  server.on('error', function onError(error: NodeJS.ErrnoException) {
    if (error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EADDRINUSE':
          log({ tags: ['api-server', 'on-error'] }).error(
            `${listeningPort} is already in use`
          );

          process.exit(1);
          break;
        default:
          throw error;
      }
    }
  });
  server.on('listening', () => {
    const addr = server.address()!;
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    log({ tags: ['api-server', 'on-listening'] }).info(
      `📻 Listening on ${bind}`
    );
  });
}
