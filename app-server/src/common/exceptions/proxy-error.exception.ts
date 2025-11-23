import { HttpException, HttpStatus } from '@nestjs/common';

export class ProxyServerUnavailableException extends HttpException {
    constructor(message?: string) {
        super(
            message || 'Proxy server is unavailable',
            HttpStatus.SERVICE_UNAVAILABLE,
        );
    }
}

export class ProxyExecutionException extends HttpException {
    constructor(message: string, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

export class ProxyTimeoutException extends HttpException {
    constructor(message?: string) {
        super(
            message || 'Proxy server request timed out',
            HttpStatus.GATEWAY_TIMEOUT,
        );
    }
}
