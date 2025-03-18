import { FastifyInstance } from 'fastify';

function exampleRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { status: 'example => ok', timestamp: new Date().toISOString() };
  });

  // API根路由
  fastify.get('/', async (request, reply) => {
    return { message: 'example => Welcome to Mind Link Proxy API' };
  });
}

export default exampleRoutes;
