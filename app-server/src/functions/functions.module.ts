import { Module } from '@nestjs/common';
import { FunctionsService } from './functions.service';
import { FunctionsController } from './functions.controller';

@Module({
    controllers: [FunctionsController],
    providers: [FunctionsService],
    exports: [FunctionsService],
})
export class FunctionsModule { }
