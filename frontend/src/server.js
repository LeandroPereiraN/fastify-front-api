import Fastify from "fastify";
import fastifyStatic from "@fastify/static"
import { dirname, join } from "node:path";

const fastify = Fastify()

await fastify.register(fastifyStatic, {
    root: join(dirname(process.argv[1]), "public"),
    prefix: "/"
})

fastify.listen({ port: 4000, host: 'localhost' }, (error) => {
    if (error) {
        console.error(error)
        process.exit(1)
    }
})