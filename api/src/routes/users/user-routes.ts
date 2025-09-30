import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { User, type UserType } from '../../types/User.ts';
import UserRepository from '../../repositories/user-repository.ts';
import { PermissionError } from '../../models/errors.ts';

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.get('/users', {
        schema: {
            description: 'Obtener todos los usuarios',
            tags: ['usuarios'],
            response: {
                200: Type.Array(User)
            }
        }
    }, async (request, reply) => {
        return await UserRepository.getUsers();
    });

    fastify.post('/users', {
        schema: {
            description: 'Crear un nuevo usuario',
            tags: ['usuarios'],
            body: Type.Object({
                nombre: Type.String({ minLength: 1, description: 'Nombre del usuario' }),
                apellido: Type.String({ minLength: 1, description: 'Apellido del usuario' }),
                isAdmin: Type.Boolean({ description: 'El usuario es administrador', default: false }),
                password: Type.String({ description: 'Contraseña del usuario' })
            }),
            response: {
                201: Type.Object({
                    message: Type.String(),
                    user: User
                }),
                400: Type.Object({
                    message: Type.String()
                })
            },
            security: [
                { bearerAuth: [] }
            ]
        },
        onRequest: async (req, res) => {
            fastify.authenticate(req, res);

            const user = req.user as UserType;
            if (!user || !user.isAdmin) {
                throw new PermissionError('No tienes permisos para realizar esta acción.');
            }
        }
    }, async (request, reply) => {
        const { nombre, apellido, isAdmin, password } = request.body;
        if (!nombre || !apellido || !password) {
            return reply.status(400).send({ message: 'Nombre, apellido y contraseña son requeridos' });
        }

        const userExist = await UserRepository.getUserByCompleteName(nombre, apellido);
        if (userExist) {
            return reply.status(400).send({ message: 'Ya existe un usuario con ese nombre y apellido' });
        }

        const newUser = { nombre, apellido, isAdmin: !!isAdmin, password };
        UserRepository.createUser(newUser);
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
                    user: User
                }),
                400: Type.Object({
                    message: Type.String()
                }),
                404: Type.Object({
                    message: Type.String()
                })
            },
            security: [
                { bearerAuth: [] }
            ]
        },
        onRequest: async (req, res) => {
            fastify.authenticate(req, res);

            const user = req.user as UserType;
            if (!user || !user.isAdmin) {
                throw new PermissionError('No tienes permisos para realizar esta acción.');
            }
        }
    }, async (request, reply) => {
        const { nombreOriginal, apellidoOriginal, nombre, apellido } = request.body;

        if (!nombre || !apellido) {
            return reply.status(400).send({ message: 'Nombre y apellido son requeridos' });
        }

        if (!nombreOriginal || !apellidoOriginal) {
            return reply.status(400).send({ message: 'Nombre original y apellido original son requeridos' });
        }

        const user = await UserRepository.getUserByCompleteName(nombreOriginal, apellidoOriginal);
        if (!user) {
            return reply.status(404).send({ message: 'Usuario no encontrado' });
        }

        const newUser = { nombre, apellido }
        const updatedUser = await UserRepository.updateUser(user, newUser);

        return reply.send({
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
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
                400: Type.Object({
                    message: Type.String()
                }),
                404: Type.Object({
                    message: Type.String()
                })
            },
            security: [
                { bearerAuth: [] }
            ]
        },
        onRequest: async (req, res) => {
            fastify.authenticate(req, res);

            const user = req.user as UserType;
            if (!user || !user.isAdmin) {
                throw new PermissionError('No tienes permisos para realizar esta acción.');
            }
        },
    }, async (request, reply) => {
        const { nombre, apellido } = request.body;

        if (!nombre || !apellido) {
            return reply.status(400).send({ message: 'Nombre y apellido son requeridos' });
        }

        const isDeleted = await UserRepository.deleteUser(nombre, apellido);
        if (!isDeleted) {
            return reply.status(404).send({ message: 'Usuario no encontrado' });
        }

        return reply.send({ message: 'Usuario eliminado exitosamente' });
    });
}

export default userRoutes;