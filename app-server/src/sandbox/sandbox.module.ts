import { Module } from '@nestjs/common';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';
import { ProxyClientModule } from '../proxy-client/proxy-client.module';
import { ExecutionsModule } from '../executions/executions.module';

@Module({
  imports: [ProxyClientModule, ExecutionsModule],
  controllers: [SandboxController],
  providers: [SandboxService],
})
export class SandboxModule { }
