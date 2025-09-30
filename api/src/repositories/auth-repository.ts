import { AuthorizedError, NotFoundError } from "../models/errors.ts";
import type { UserType } from "../types/User.ts";
import UserRepository from "./user-repository.ts"

class AuthRepository {
  static async login(nombre: string, apellido: string, password: string): Promise<UserType> {
    const user = await UserRepository.getUserByCompleteName(nombre, apellido);
    if (!user) throw new NotFoundError("Usuario no encontrado");

    const isAuthenticated = await UserRepository.authenticate(nombre, apellido, password);
    if (!isAuthenticated) throw new AuthorizedError("Contraseña incorrecta");

    return user as UserType;
  }
}

export default AuthRepository;