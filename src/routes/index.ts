import { FastifyInstance } from 'fastify';
import exampleRoutes from './api/example';
import emailRoutes from './api/email';


export function registerRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API根路由
  fastify.get('/', async (request, reply) => {
    return { message: 'Welcome to api.qdkf.net' };
  });

  // 示例API路由
  fastify.register(exampleRoutes, { prefix: '/api' });
  fastify.register(emailRoutes, { prefix: '/api/email' });

}
