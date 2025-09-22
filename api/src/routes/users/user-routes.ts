import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type, type Static } from '@sinclair/typebox';

const UserResponseSchema = Type.Object({
  nombre: Type.String(),
  apellido: Type.String()
});

type UserResponse = Static<typeof UserResponseSchema>;
const usuarios: UserResponse[] = [
    { nombre: "Pepe", apellido: "Sanchez" },
    { nombre: "Juan", apellido: "Perez" }
];

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.get('/users', {
        schema: {
            description: 'Obtener todos los usuarios',
            tags: ['usuarios'],
            response: {
                200: Type.Array(UserResponseSchema)
            }
        }
    }, async (request, reply) => {
        return usuarios;
    });

    fastify.post('/users', {
        schema: {
            description: 'Crear un nuevo usuario',
            tags: ['usuarios'],
            body: Type.Object({
                nombre: Type.String({ minLength: 1, description: 'Nombre del usuario' }),
                apellido: Type.String({ minLength: 1, description: 'Apellido del usuario' })
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                    user: UserResponseSchema
                }),
                400: Type.Object({
                    message: Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const { nombre, apellido } = request.body;
        if (!nombre || !apellido) {
            return reply.status(400).send({ message: 'Nombre y apellido son requeridos' });
        }

        const newUser: UserResponse = { nombre, apellido };
        usuarios.push(newUser);
        
        console.log('Usuario creado:', request.body);
        
        return reply.status(201).send({
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    });
}

export default userRoutes;