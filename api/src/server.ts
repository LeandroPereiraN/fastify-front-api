import Fastify from "fastify";
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import formbody from "@fastify/formbody";
import swaggerPlugin from './plugins/swagger.ts';
import corsPlugin from './plugins/cors.ts';
import userRoutes from './routes/users/user-routes.ts';

const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

await fastify.register(formbody);
await fastify.register(swaggerPlugin);
await fastify.register(corsPlugin);
await fastify.register(userRoutes);

try {
    await fastify.listen({ port: 3000, host: 'localhost' });
    console.log('Servidor ejecutándose en http://localhost:3000');
    console.log('Documentación Swagger disponible en: http://localhost:3000/docs');
} catch (error) {
    fastify.log.error(error);
    process.exit(1);
}