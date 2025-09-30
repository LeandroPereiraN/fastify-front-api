class AuthService {
    constructor() {
        this.endpoint = '/login';
    }

    async loginUser(nombre, apellido, password) {
        try {
            const existingUsers = await userService.getAllUsers();
            const userExists = existingUsers.some(user =>
                user.nombre.toLowerCase() === nombre.toLowerCase() &&
                user.apellido.toLowerCase() === apellido.toLowerCase()
            );

            if (!userExists) {
                errorHandler.showError('Usuario no encontrado');
                return false;
            }

            const result = await apiService.post(this.endpoint, {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                password: password.trim()
            });

            if (result !== null) {
                localStorage.setItem('token', result.token)
                errorHandler.showSuccess('Sesión iniciada correctamente');
                return true;
            }
            return false;
        } catch (error) {
            errorHandler.handleAppError('inciar sesión', error);
            return false;
        }
    }

    async logoutUser() {
        localStorage.removeItem('token')
    }
}

const authService = new AuthService();