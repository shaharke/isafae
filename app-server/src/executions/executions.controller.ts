import { Controller, Get, Post, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { CreateExecutionDto, CreateExecutionSchema } from './dto/create-execution.dto';

@Controller('executions')
export class ExecutionsController {
    constructor(private readonly executionsService: ExecutionsService) { }

    @Post()
    async create(@Body() createExecutionDto: CreateExecutionDto) {
        return this.executionsService.create(createExecutionDto);
    }

    @Get()
    async findAll(
        @Query('session_id') sessionId?: string,
        @Query('function_id') functionId?: string,
    ) {
        return this.executionsService.findAll(sessionId, functionId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const execution = await this.executionsService.findOne(id);
        if (!execution) {
            throw new NotFoundException(`Execution with ID ${id} not found`);
        }
        return execution;
    }
}
