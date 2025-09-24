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

        const usuarioExistente = usuarios.find(u => u.nombre === nombre && u.apellido === apellido);
        if (usuarioExistente) {
            return reply.status(400).send({ message: 'Ya existe un usuario con ese nombre y apellido' });
        }

        const newUser: UserResponse = { nombre, apellido };
        usuarios.push(newUser);
        
        console.log('Usuario creado:', request.body);
        
        return reply.status(201).send({
            message: 'Usuario creado exitosamente',
            user: newUser
        });
    });

    fastify.put('/users', {
        schema: {
            description: 'Actualizar un usuario existente',
            tags: ['usuarios'],
            body: Type.Object({
                nombreOriginal: Type.String(),
                apellidoOriginal: Type.String(),
                nombre: Type.String({ minLength: 1 }),
                apellido: Type.String({ minLength: 1 })
            }),
            response: {
                200: Type.Object({
                    message: Type.String(),
                    user: UserResponseSchema
                }),
                400: Type.Object({
                    message: Type.String()
                }),
                404: Type.Object({
                    message: Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const { nombreOriginal,apellidoOriginal,nombre,apellido } = request.body;
    
        if (!nombre || !apellido) {
            return reply.status(400).send({ message: 'Nombre y apellido son requeridos' });
        }

        const userUpdate = usuarios.findIndex(u => 
            u.nombre === nombreOriginal && u.apellido === apellidoOriginal
        );
        if (userUpdate === -1) {
            return reply.status(404).send({ message: 'Usuario no encontrado' });
        }

        usuarios[userUpdate] = { nombre, apellido };
        
        return reply.send({
            message: 'Usuario actualizado exitosamente',
            user: usuarios[userUpdate]
        });
    });

    fastify.delete('/users', {
        schema: {
            description: 'Eliminar un usuario',
            tags: ['usuarios'],
            body: Type.Object({
                nombre: Type.String(),
                apellido: Type.String()
            }),
            response: {
                200: Type.Object({
                    message: Type.String()
                }),
                404: Type.Object({
                    message: Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const { nombre, apellido } = request.body;
        
        const userDelete = usuarios.findIndex(u => 
            u.nombre === nombre && u.apellido === apellido
        );
        
        if (userDelete === -1) {
            return reply.status(404).send({ message: 'Usuario no encontrado' });
        }
        usuarios.splice(userDelete, 1);
        
        return reply.send({ message: 'Usuario eliminado exitosamente' });
    });
}

export default userRoutes;