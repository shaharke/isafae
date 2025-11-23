import { Injectable } from '@nestjs/common';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ProxyClientService } from '../proxy-client/proxy-client.service';
import { ExecutionResult } from '../proxy-client/dto/execution-result.dto';

@Injectable()
export class SandboxService {
  constructor(private readonly proxyClient: ProxyClientService) { }

  async executeCode(executeCodeDto: ExecuteCodeDto): Promise<ExecutionResult> {
    return this.proxyClient.executeCode(executeCodeDto);
  }
}
