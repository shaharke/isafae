import { ExecutionResult } from '../../proxy-client/dto/execution-result.dto';

export interface SandboxExecutionResult extends ExecutionResult {
    execution_id: string;
}
