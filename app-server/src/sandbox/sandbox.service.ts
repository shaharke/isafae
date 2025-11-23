import { Injectable } from '@nestjs/common';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ProxyClientService } from '../proxy-client/proxy-client.service';
import { ExecutionsService } from '../executions/executions.service';
import { SandboxExecutionResult } from './dto/sandbox-execution-result.dto';

@Injectable()
export class SandboxService {
  constructor(
    private readonly proxyClient: ProxyClientService,
    private readonly executionsService: ExecutionsService,
  ) { }

  async executeCode(executeCodeDto: ExecuteCodeDto): Promise<SandboxExecutionResult> {
    const start = Date.now();
    const result = await this.proxyClient.executeCode(executeCodeDto);
    const duration = Date.now() - start;

    const execution = await this.executionsService.create({
      function_id: executeCodeDto.function_id,
      session_id: executeCodeDto.session_id,
      user_id: executeCodeDto.user_id,
      code: executeCodeDto.code,
      input_params: null, // We don't have structured input params in this raw execute endpoint
      stdout: result.stdout,
      stderr: result.stderr,
      exit_code: result.exit_code,
      execution_time_ms: duration,
      libraries: executeCodeDto.libraries,
    });

    return {
      ...result,
      execution_id: execution.id,
    };
  }
}
