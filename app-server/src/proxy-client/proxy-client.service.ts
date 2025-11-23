import { Injectable } from '@nestjs/common';
import { FetchConfig } from '../common/config/fetch.config';
import {
    ProxyServerUnavailableException,
    ProxyExecutionException,
    ProxyTimeoutException,
} from '../common/exceptions/proxy-error.exception';
import { ExecutionResult } from './dto/execution-result.dto';
import { ExecuteCodeDto } from '../sandbox/dto/execute-code.dto';

@Injectable()
export class ProxyClientService {
    async executeCode(request: ExecuteCodeDto): Promise<ExecutionResult> {
        try {
            const result = await FetchConfig.request<ExecutionResult>('/execute', {
                method: 'POST',
                body: JSON.stringify({
                    code: request.code,
                    lang: request.lang || 'python',
                    keep_template: request.keep_template || false,
                    libraries: request.libraries || [],
                }),
            });

            return result;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
        // Timeout errors
        if (error.code === 'ETIMEDOUT' || error.name === 'AbortError') {
            throw new ProxyTimeoutException(
                `Proxy server request timed out: ${error.message}`,
            );
        }

        // HTTP error responses from proxy server
        if (error.response) {
            const status = error.response.status;
            const message =
                error.response.data?.detail ||
                error.response.data?.message ||
                error.message;

            throw new ProxyExecutionException(
                `Proxy server error: ${message}`,
                status,
            );
        }

        // Network errors (proxy server down, DNS issues, etc.)
        throw new ProxyServerUnavailableException(
            `Cannot connect to proxy server: ${error.message}`,
        );
    }
}
