import { Controller, Get, Post, Body, Param, Put, Query, NotFoundException } from '@nestjs/common';
import { FunctionsService } from './functions.service';
import { CreateFunctionDto, CreateFunctionSchema } from './dto/create-function.dto';
import { FunctionStatus } from '@prisma/client';

@Controller('functions')
export class FunctionsController {
    constructor(private readonly functionsService: FunctionsService) { }

    @Get()
    async findAll(@Query('prompt_id') promptId?: string) {
        return this.functionsService.findAll(promptId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const func = await this.functionsService.findOne(id);
        if (!func) {
            throw new NotFoundException(`Function with ID ${id} not found`);
        }
        return func;
    }

    @Put(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: FunctionStatus,
    ) {
        try {
            return await this.functionsService.updateStatus(id, status);
        } catch (error) {
            throw new NotFoundException(`Function with ID ${id} not found`);
        }
    }
}
