import bcrypt from "bcrypt";
import { NotFoundError } from "../models/errors.ts";
import { type UserType } from "../types/User.ts";

const users: (UserType & { password: string })[] = [
  { nombre: "Pepe", apellido: "Sanchez", isAdmin: false, password: '$2a$10$te2xlvdi194oU068ihepjOYkU7oveeyzBdrlXNHA0uc0ZZE70hMB2' }, // password = contraseña
  { nombre: "Juan", apellido: "Perez", isAdmin: true, password: '$2a$10$te2xlvdi194oU068ihepjOYkU7oveeyzBdrlXNHA0uc0ZZE70hMB2' } // password = contraseña
];

const getUsersWithoutPassword = () => users.map(({ password, ...rest }) => rest);

class UserRepository {
  static async authenticate(nombre: string, apellido: string, password: string): Promise<UserType | null> {
    const user = await this.getUserByCompleteName(nombre, apellido);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user as UserType;
  }

  static getUsers = async () => {
    return getUsersWithoutPassword();
  }

  static getUserByCompleteName = async (nombre: string, apellido: string) => {
    return users.find(u => u.nombre.toLowerCase() === nombre.toLowerCase()
      && u.apellido.toLowerCase() === apellido.toLowerCase()
    );
  }

  static createUser = async (newUser: UserType & { password: string }) => {
    const { password } = newUser
    const encryptedPassword = await bcrypt.hash(password, 10)

    users.push({ ...newUser, password: encryptedPassword });
  }

  static updateUser = async (user: UserType, newUser: Omit<UserType, 'isAdmin'>) => {
    if (user) {
      Object.assign(user, newUser);
      return user;
    }

    throw new NotFoundError();
  }

  static deleteUser = async (nombre: string, apellido: string) => {
    const userDelete = users.findIndex(u =>
      u.nombre === nombre && u.apellido === apellido
    );
    if (userDelete !== -1) {
      users.splice(userDelete, 1);
      return true;
    }
    return false;
  }
}

export default UserRepository;