class ApiService {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const token = localStorage.getItem("token");

        const config = {
            ...options,
            headers: {
                ...(options.headers || {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                await errorHandler.handleHttpError(response);
                return null;
            }

            return response;
        } catch (error) {
            errorHandler.handleNetworkError(error);
            return null;
        }
    }

    async get(endpoint, headers = {}) {
        const response = await this.request(endpoint, {
            method: 'GET',
            headers
        });

        if (response) {
            return await response.json();
        }
        return null;
    }

    async post(endpoint, data = {}, headers = {}) {
        const response = await this.request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });

        if (response) {
            return await response.json();
        }
        return null;
    }

    async put(endpoint, data = {}, headers = {}) {
        const response = await this.request(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });

        if (response) {
            return await response.json();
        }
        return null;
    }

    async delete(endpoint, data = {}, headers = {}) {
        const config = {
            method: 'DELETE',
            headers: { ...headers }
        };

        if (data && Object.keys(data).length > 0) {
            config.body = JSON.stringify(data);
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await this.request(endpoint, config);

        if (response) {
            try {
                return await response.json();
            } catch {
                return true;
            }
        }
        return null;
    }
}

const apiService = new ApiService();