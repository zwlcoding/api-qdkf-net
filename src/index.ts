/// <reference path="../global.d.ts" />

import Fastify from 'fastify';

import { registerPlugins } from './plugins/index';
import { registerRoutes } from './routes/index';

const fastify = Fastify({ logger: true });

const initialize = async () => {
  try {
    await registerPlugins(fastify);
    await registerRoutes(fastify);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    const env = fastify.getEnvs<EnvSchema>();
    await fastify.listen({
      host: env.SERVE_HOST,
      port: parseInt(env.SERVE_PORT, 10),
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

initialize()
  .then(() => startServer())
  .catch((error) => {
    fastify.log.error(error);
    process.exit(1);
  });
