import { Type, type Static } from '@sinclair/typebox';

export const User = Type.Object({
  nombre: Type.String(),
  apellido: Type.String(),
  isAdmin: Type.Boolean()
});

export type UserType = Static<typeof User>;