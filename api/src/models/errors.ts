import { createError } from '@fastify/error'

export const ServerInternalError = createError('Error_del_servidor', 'Se ha producido un error en el servidor ', 500);
export const NotFoundError = createError('No_encontrado', 'El elemento no se ha encontrado', 404);
export const AuthorizedError = createError('No_autorizado', 'No esta autorizado', 401);
export const BadRequestError = createError('Peticion_incorrecta', 'La peticion es incorrecta', 400);
export const PermissionError = createError('Sin_permisos', 'No se cumple con los permisos necesarios', 403);
export const DataBaseConnectionError = createError('Error_de_conexion_con_la_base_de_datos', 'No se ha podido conectar con la base de datos', 500);