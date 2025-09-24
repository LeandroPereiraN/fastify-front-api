class ErrorHandler {
    constructor() {
        this.errorMessages = {
            400: 'Solicitud incorrecta. Verifica los datos enviados.',
            401: 'No autorizado. Inicia sesión para continuar.',
            403: 'Acceso prohibido. No tienes permisos para realizar esta acción.',
            404: 'Recurso no encontrado.',
            422: 'Datos no válidos. Verifica la información proporcionada.',
            500: 'Error interno del servidor. Intenta nuevamente más tarde.',
            502: 'Error de conexión con el servidor.',
            503: 'Servicio no disponible temporalmente.',
            default: 'Ocurrió un error inesperado.'
        };
    }

    async handleHttpError(response) {
        const status = response.status;
        
        try {
            const errorData = await response.json();
            const serverMessage = errorData.message || errorData.error;
            
            switch (status) {
                case 401:
                    this.handleUnauthorized(serverMessage);
                    break;
                case 404:
                    this.handleNotFound(serverMessage);
                    break;
                case 422:
                    this.handleValidationError(serverMessage);
                    break;
                case 500:
                    this.handleServerError(serverMessage);
                    break;
                default:
                    this.showError(serverMessage || this.errorMessages[status] || this.errorMessages.default);
            }
        } catch {
            const message = this.errorMessages[status] || this.errorMessages.default;
            this.showError(message);
        }

        console.error(`HTTP Error ${status}:`, response.statusText);
    }

    handleNetworkError(error) {
        console.error('Network Error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            this.showError('Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.');
        } else {
            this.showError('Error de red. Intenta nuevamente.');
        }
    }

    handleUnauthorized(message) {
        this.showError(message || this.errorMessages[401]);
        
        setTimeout(() => {
            console.log('Redirección a login requerida');
        }, 2000);
    }

    handleNotFound(message) {
        this.showError(message || this.errorMessages[404]);
    }

    handleValidationError(message) {
        this.showError(message || this.errorMessages[422]);
    }

    handleServerError(message) {
        this.showError(message || this.errorMessages[500]);
    }

    showError(message, type = 'error') {
        alert(`${type.toUpperCase()}: ${message}`);
        
        console.error('Error mostrado al usuario:', message);
    }

    showSuccess(message) {
        alert(`ÉXITO: ${message}`);
        console.log('Mensaje de éxito:', message);
    }

    showInfo(message) {
        alert(`INFO: ${message}`);
        console.info('Información:', message);
    }

    handleAppError(operation, error) {
        console.error(`Error en ${operation}:`, error);
        
        const userMessage = `Error al ${operation.toLowerCase()}. ${error.message || 'Intenta nuevamente.'}`;
        this.showError(userMessage);
    }

    validateResponse(response) {
        if (!response) {
            this.showError('No se recibió respuesta del servidor');
            return false;
        }
        return true;
    }
}

const errorHandler = new ErrorHandler();