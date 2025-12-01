import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SandboxModule } from './sandbox/sandbox.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { ExecutionsModule } from './executions/executions.module';
import { PromptsModule } from './prompts/prompts.module';
import { FunctionsModule } from './functions/functions.module';
import { AdminModule } from './admin/admin.module';

const baseImports = [
  SandboxModule,
  PrismaModule,
  SessionsModule,
  ExecutionsModule,
  PromptsModule,
  FunctionsModule,
  AdminModule,
];

@Module({
  imports: baseImports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
