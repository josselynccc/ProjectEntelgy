export class ApiClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }
    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP status error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error', error);
            throw error;
        }
    }
}