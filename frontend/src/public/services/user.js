class UserService {
    constructor() {
        this.endpoint = '/users';
    }

    async getAllUsers() {
        try {
            const users = await apiService.get(this.endpoint);
            return users || [];
        } catch (error) {
            errorHandler.handleAppError('obtener usuarios', error);
            return [];
        }
    }

    async createUser(nombre, apellido) {
        if (!this.validateUserData(nombre, apellido)) {
            return false;
        }

        try {
            const existingUsers = await this.getAllUsers();
            const userExists = existingUsers.some(user => 
                user.nombre.toLowerCase() === nombre.toLowerCase() && 
                user.apellido.toLowerCase() === apellido.toLowerCase()
            );

            if (userExists) {
                errorHandler.showError('Ya existe un usuario con ese nombre y apellido');
                return false;
            }

            const result = await apiService.post(this.endpoint, {
                nombre: nombre.trim(),
                apellido: apellido.trim()
            });

            if (result !== null) {
                errorHandler.showSuccess('Usuario creado exitosamente');
                return true;
            }
            return false;
        } catch (error) {
            errorHandler.handleAppError('crear usuario', error);
            return false;
        }
    }

    async updateUser(originalUser, newNombre, newApellido) {
        if (!this.validateUserData(newNombre, newApellido)) {
            return false;
        }

        if (originalUser.nombre === newNombre && originalUser.apellido === newApellido) {
            errorHandler.showInfo('No se han realizado cambios');
            return false;
        }

        try {
            const existingUsers = await this.getAllUsers();
            const userExists = existingUsers.some(user => 
                user.nombre.toLowerCase() === newNombre.toLowerCase() && 
                user.apellido.toLowerCase() === newApellido.toLowerCase() &&
                !(user.nombre === originalUser.nombre && user.apellido === originalUser.apellido)
            );

            if (userExists) {
                errorHandler.showError('Ya existe un usuario con ese nombre y apellido');
                return false;
            }

            const result = await apiService.put(this.endpoint, {
                nombreOriginal: originalUser.nombre,
                apellidoOriginal: originalUser.apellido,
                nombre: newNombre.trim(),
                apellido: newApellido.trim()
            });

            if (result !== null) {
                errorHandler.showSuccess('Usuario modificado exitosamente');
                return true;
            }
            return false;
        } catch (error) {
            errorHandler.handleAppError('modificar usuario', error);
            return false;
        }
    }

    async deleteUser(nombre, apellido) {
        if (!nombre || !apellido) {
            errorHandler.showError('Nombre y apellido son requeridos para eliminar');
            return false;
        }

        try {
            const result = await apiService.delete(this.endpoint, {
                nombre: nombre,
                apellido: apellido
            });

            if (result !== null) {
                errorHandler.showSuccess('Usuario eliminado exitosamente');
                return true;
            }
            return false;
        } catch (error) {
            errorHandler.handleAppError('eliminar usuario', error);
            return false;
        }
    }

    async findUser(nombre, apellido) {
        try {
            const users = await this.getAllUsers();
            return users.find(user => 
                user.nombre.toLowerCase() === nombre.toLowerCase() && 
                user.apellido.toLowerCase() === apellido.toLowerCase()
            ) || null;
        } catch (error) {
            errorHandler.handleAppError('buscar usuario', error);
            return null;
        }
    }

    async getUserByIndex(index) {
        try {
            const users = await this.getAllUsers();
            return users[index] || null;
        } catch (error) {
            errorHandler.handleAppError('obtener usuario por índice', error);
            return null;
        }
    }

    validateUserData(nombre, apellido) {
        if (!nombre || !apellido) {
            errorHandler.showError('Nombre y apellido son requeridos');
            return false;
        }

        if (nombre.trim().length < 2 || apellido.trim().length < 2) {
            errorHandler.showError('Nombre y apellido deben tener al menos 2 caracteres');
            return false;
        }

        return true;
    }

    async getUserCount() {
        try {
            const users = await this.getAllUsers();
            return users.length;
        } catch (error) {
            errorHandler.handleAppError('contar usuarios', error);
            return 0;
        }
    }
}

const userService = new UserService();