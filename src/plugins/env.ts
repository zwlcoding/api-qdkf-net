import fastifyEnv from '@fastify/env';
import fastifyPlugin from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const envPlugin: FastifyPluginAsync = fastifyPlugin(async (fastify) => {
  const envSchema = {
    type: 'object',
    required: [
      'SERVE_HOST',
      'SERVE_PORT',
      'CORS_ORIGIN',
      'CORS_METHODS',
      'CORS_HEADERS',
    ],
    properties: {
      SERVE_HOST: { type: 'string' },
      SERVE_PORT: { type: 'string' },
      CORS_ORIGIN: { type: 'string' },
      CORS_METHODS: { type: 'string' },
      CORS_HEADERS: { type: 'string' },
    },
  };

  const envOptions = {
    confKey: 'config', // optional, default: 'config'
    schema: envSchema,
    data: process.env, // optional, default: process.env
    dotenv: {
      debug: true,
    },
    removeAdditional: true,
  };

  await fastify.register(fastifyEnv, envOptions);
});

export default envPlugin;
