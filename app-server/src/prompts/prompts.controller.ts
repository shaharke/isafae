import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto, CreatePromptSchema } from './dto/create-prompt.dto';
import { GenerateFunctionDto, GenerateFunctionSchema } from './dto/generate-function.dto';

@Controller('prompts')
export class PromptsController {
    constructor(private readonly promptsService: PromptsService) { }

    @Post(':id/generate')
    async generate(@Param('id') id: string, @Body() generateDto: GenerateFunctionDto) {
        return this.promptsService.generateFunction(id, generateDto);
    }

    @Post()
    async create(@Body() createPromptDto: CreatePromptDto) {
        return this.promptsService.create(createPromptDto);
    }

    @Get()
    async findAll() {
        return this.promptsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const prompt = await this.promptsService.findOne(id);
        if (!prompt) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }
        return prompt;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePromptDto: Partial<CreatePromptDto>) {
        try {
            return await this.promptsService.update(id, updatePromptDto);
        } catch (error) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            return await this.promptsService.remove(id);
        } catch (error) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }
    }
}
