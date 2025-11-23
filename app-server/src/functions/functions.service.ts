import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFunctionDto } from './dto/create-function.dto';
import { Function, FunctionStatus } from '@prisma/client';

@Injectable()
export class FunctionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createFunctionDto: CreateFunctionDto): Promise<Function> {
        // Get latest version for this prompt
        const latestFunction = await this.prisma.function.findFirst({
            where: { promptId: createFunctionDto.prompt_id },
            orderBy: { version: 'desc' },
        });

        const version = latestFunction ? latestFunction.version + 1 : 1;

        return this.prisma.function.create({
            data: {
                promptId: createFunctionDto.prompt_id,
                name: createFunctionDto.name,
                code: createFunctionDto.code,
                lang: createFunctionDto.lang,
                llmModel: createFunctionDto.llm_model,
                libraries: createFunctionDto.libraries,
                userId: createFunctionDto.user_id,
                metadata: createFunctionDto.metadata,
                version,
                status: FunctionStatus.DRAFT,
            },
        });
    }

    async findAll(promptId?: string): Promise<Function[]> {
        const where: any = {};
        if (promptId) where.promptId = promptId;

        return this.prisma.function.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Function | null> {
        return this.prisma.function.findUnique({
            where: { id },
            include: { executions: true },
        });
    }

    async updateStatus(id: string, status: FunctionStatus): Promise<Function> {
        return this.prisma.function.update({
            where: { id },
            data: { status },
        });
    }
}
