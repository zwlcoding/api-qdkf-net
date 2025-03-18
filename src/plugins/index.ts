import { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';
import envPlugin from './env';
import corsPlugin from './cors';

export async function registerPlugins(fastify: FastifyInstance): Promise<void> {
  // 注册核心插件
  await fastify.register(sensible);

  // 注册环境变量插件
  await fastify.register(envPlugin);

  // 注册CORS插件
  await fastify.register(corsPlugin);

  // 这里可以注册更多插件
}
