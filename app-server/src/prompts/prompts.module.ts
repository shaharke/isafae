import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { FunctionsModule } from '../functions/functions.module';

@Module({
    imports: [FunctionsModule],
    controllers: [PromptsController],
    providers: [PromptsService],
    exports: [PromptsService],
})
export class PromptsModule { }
