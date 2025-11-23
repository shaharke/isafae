import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { GenerateFunctionDto } from './dto/generate-function.dto';
import { Prompt } from '@prisma/client';
import { FunctionsService } from '../functions/functions.service';
import { FunctionStatus } from '@prisma/client';

@Injectable()
export class PromptsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly functionsService: FunctionsService,
    ) { }

    async generateFunction(id: string, generateDto: GenerateFunctionDto) {
        const prompt = await this.findOne(id);
        if (!prompt) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }

        // Mock LLM Generation Logic
        const snakeCaseTitle = prompt.title.toLowerCase().replace(/\s+/g, '_');
        const generatedCode = `def ${snakeCaseTitle}(params):
    """
    ${prompt.description}
    """
    # TODO: Implement logic based on input_schema and output_schema
    print("This is a generated function stub for: ${prompt.title}")
    return {"status": "success"}
`;

        // Create the function entity using FunctionsService
        return this.functionsService.create({
            prompt_id: id,
            name: snakeCaseTitle,
            code: generatedCode,
            lang: 'python',
            llm_model: generateDto.llm_model || 'gpt-4',
            libraries: [],
            user_id: prompt.userId || undefined,
            metadata: {
                generation_method: 'mock',
                original_prompt_version: 1 // Placeholder
            }
        });
    }

    async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
        return this.prisma.prompt.create({
            data: {
                title: createPromptDto.title,
                description: createPromptDto.description,
                inputSchema: createPromptDto.input_schema,
                outputSchema: createPromptDto.output_schema,
                tags: createPromptDto.tags,
                userId: createPromptDto.user_id,
            },
        });
    }

    async findAll(): Promise<Prompt[]> {
        return this.prisma.prompt.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Prompt | null> {
        return this.prisma.prompt.findUnique({
            where: { id },
            include: { functions: true },
        });
    }

    async update(id: string, updateData: Partial<CreatePromptDto>): Promise<Prompt> {
        return this.prisma.prompt.update({
            where: { id },
            data: {
                title: updateData.title,
                description: updateData.description,
                inputSchema: updateData.input_schema,
                outputSchema: updateData.output_schema,
                tags: updateData.tags,
            },
        });
    }

    async remove(id: string): Promise<Prompt> {
        return this.prisma.prompt.delete({
            where: { id },
        });
    }
}
