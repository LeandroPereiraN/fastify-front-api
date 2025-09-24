import fp from 'fastify-plugin'
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: (origin, cb) => {
        if (!origin) {
            cb(null, true);
            return;
        }
        
        const hostname = new URL(origin).hostname;
        if (hostname === "localhost") {
            cb(null, true);
            return;
        }

        cb(new Error("Not allowed"), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});
})