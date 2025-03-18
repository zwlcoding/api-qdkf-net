import fastifyPlugin from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import { FastifyPluginAsync } from 'fastify';

const corsPlugin: FastifyPluginAsync = fastifyPlugin(async (fastify) => {

  const env = fastify.getEnvs<EnvSchema>();

  // 确保CORS配置有效
  const corsOptions = {
    origin: env.CORS_ORIGIN === '*' ? "*" : env.CORS_ORIGIN.split(','),
    methods: env.CORS_METHODS.split(','),
    allowedHeaders: env.CORS_HEADERS.split(','),
    exposedHeaders: env.CORS_HEADERS.split(','),
    credentials: true,
    maxAge: 86400,
    preflight: true,
  };

  fastify.log.info(`CORS configured with origin: ${env.CORS_ORIGIN}`);

  await fastify.register(fastifyCors, corsOptions);
});

export default corsPlugin;
