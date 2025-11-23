export class FetchConfig {
    private static baseURL: string;
    private static timeout: number;

    static initialize() {
        this.baseURL = process.env.PROXY_SERVER_URL || 'http://localhost:8000';
        this.timeout = parseInt(process.env.PROXY_SERVER_TIMEOUT || '60000', 10);
    }

    static async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        if (!this.baseURL) {
            this.initialize();
        }

        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw {
                    response: {
                        status: response.status,
                        data: errorData,
                    },
                    message: errorData.detail || errorData.message || response.statusText,
                };
            }

            return await response.json();
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw {
                    code: 'ETIMEDOUT',
                    message: 'Request timeout',
                };
            }

            if (error.response) {
                // Already formatted error from !response.ok case
                throw error;
            }

            // Network error
            throw {
                message: error.message,
                code: error.code || 'NETWORK_ERROR',
            };
        }
    }
}
