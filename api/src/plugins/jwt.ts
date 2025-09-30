import fastifyPlugin from 'fastify-plugin'
import jwt from '@fastify/jwt'
import type { UserType } from '../types/User.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default fastifyPlugin(async (fastify, opts) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
  })

  fastify.decorate("authenticate", async function (req: FastifyRequest, res: FastifyReply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      return res.status(401).send({
        code: "NO_AUTORIZADO",
        message: "No está autorizado"
      });
    }
  })
})

declare module 'fastify' {
  interface FastifyJWT {
    user: UserType
    payload: UserType
  }

  interface FastifyInstance {
    authenticate(req: FastifyRequest, res: FastifyReply): Promise<void>
  }
}