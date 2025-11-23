import { Module } from '@nestjs/common';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';
import { ProxyClientModule } from '../proxy-client/proxy-client.module';

@Module({
  imports: [ProxyClientModule],
  controllers: [SandboxController],
  providers: [SandboxService],
})
export class SandboxModule { }
