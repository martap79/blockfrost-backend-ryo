import fastifyCors from '@fastify/cors';
import fastifyPostgres from '@fastify/postgres';
import * as Sentry from '@sentry/node';
import fastify, { FastifyInstance } from 'fastify';
import os from 'os';

import { getConfig } from './config';
import { registerRoute } from './utils/common';
import { errorHandler, notFoundHandler } from './utils/error-handler';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

const config = getConfig();
const start = (options = {}): FastifyInstance => {
  const app = fastify(options);

  if (process.env.SENTRY_DSN) {
    console.info('Sentry is ON');

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      release: `blockfrost-backend@${packageJson.version}`,
      serverName: os.hostname(),
      sampleRate: 0.01,
    });
  }

  // ORDERING BASED ON https://www.fastify.io/docs/latest/Guides/Getting-Started/#loading-order-of-your-plugins
  // Note: We don't use custom decorators and hooks (parts 3-4 from ^)

  app.register(fastifyCors, {
    origin: '*',
  });

  app.setErrorHandler((error, request, reply) => {
    errorHandler(error, request, reply);
  });

  app.setNotFoundHandler((request, reply) => {
    notFoundHandler(request, reply);
  });

  app.register(fastifyPostgres, {
    name: 'dbSync',
    host: config.dbSync.host,
    user: config.dbSync.user,
    database: config.dbSync.database,
    max: config.dbSync.maxConnections,
  });

  registerRoute(app, import('./routes/accounts'));
  registerRoute(app, import('./routes/addresses'));
  registerRoute(app, import('./routes/assets'));

  // health
  registerRoute(app, import('./routes/health'));
  registerRoute(app, import('./routes/health/clock'));

  // blocks
  registerRoute(app, import('./routes/blocks/slot/slot-number'));
  registerRoute(app, import('./routes/blocks/latest/index'));
  registerRoute(app, import('./routes/blocks/latest/txs'));
  registerRoute(app, import('./routes/blocks/epoch/epoch-number/slot/slot-number'));
  registerRoute(app, import('./routes/blocks/hash-or-number/index'));
  registerRoute(app, import('./routes/blocks/hash-or-number/addresses'));
  registerRoute(app, import('./routes/blocks/hash-or-number/txs'));
  registerRoute(app, import('./routes/blocks/hash-or-number/previous'));
  registerRoute(app, import('./routes/blocks/hash-or-number/next'));

  registerRoute(app, import('./routes/epochs'));

  // ledger
  registerRoute(app, import('./routes/ledger'));

  registerRoute(app, import('./routes/metadata'));

  // network
  registerRoute(app, import('./routes/network'));
  registerRoute(app, import('./routes/network/eras'));

  registerRoute(app, import('./routes/nutlink'));
  registerRoute(app, import('./routes/pools'));

  // root
  registerRoute(app, import('./routes/root'));

  registerRoute(app, import('./routes/scripts'));
  registerRoute(app, import('./routes/txs'));

  // utils
  registerRoute(app, import('./routes/utils/addresses/xpub/xpub/role/index'));

  process.on('SIGINT', () => {
    app.close();

    console.info('Server stopped');
    process.exit(0);
  });

  return app;
};

start();

export default start;
