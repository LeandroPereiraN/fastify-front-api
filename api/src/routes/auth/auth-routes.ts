import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { AuthorizedError } from "../../models/errors.ts";
import AuthRepository from "../../repositories/auth-repository.ts"

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/login', {
    schema: {
      tags: ["auth"],
      summary: "Obtiene un token JWT",
      description: "Autentica usuario y contraseña, devuelve un token JWT si es correcto",
      body: Type.Object({
        nombre: Type.String({ minLength: 2 }),
        apellido: Type.String({ minLength: 2 }),
        password: Type.String()
      }),
      response: {
        200: Type.Object({ token: Type.String() }),
        401: Type.Object({ message: Type.String() })
      }
    }
  }, async (req, res) => {
    const { nombre, apellido, password } = req.body;

    const user = await AuthRepository.login(nombre, apellido, password);
    if (!user) {
      throw new AuthorizedError("Usuario no encontrado");
    }

    const token = fastify.jwt.sign({
      nombre: user.nombre,
      apellido: user.apellido,
      isAdmin: user.isAdmin
    }, {
      expiresIn: '1h',
      notBefore: '0s',
    });

    return { token };
  })
}

export default userRoutes