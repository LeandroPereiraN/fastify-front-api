import Fastify from "fastify";
import formbody from "@fastify/formbody"
import fastifyStatic from "@fastify/static"
import { dirname, join } from "node:path";
import cors from '@fastify/cors'

const fastify = Fastify()
const usuarios = [
    { nombre: "Pepe", apellido: "Sanchez" },
    { nombre: "Juan", apellido: "Perez" }
]

await fastify.register(cors, {
    origin: (origin, cb) => {
        const hostname = new URL(origin).hostname
        if (hostname === "localhost") {
            cb(null, true)
            return
        }

        cb(new Error("Not allowed"), false)
    }
})

await fastify.register(formbody);

fastify.get('/users', (req, rep) => {
    return usuarios;
})

fastify.post('/users', (req, rep) => {
    const { nombre, apellido } = req.body

    usuarios.push({ nombre, apellido });
    rep.status(201)
    console.log(req.body)
})

fastify.listen({ port: 3000, host: 'localhost' }, (error) => {
    if (error) {
        console.error(error)
        process.exit(1)
    }
})