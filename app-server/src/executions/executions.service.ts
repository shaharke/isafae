import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { Execution } from '@prisma/client';

@Injectable()
export class ExecutionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createExecutionDto: CreateExecutionDto): Promise<Execution> {
        return this.prisma.execution.create({
            data: {
                functionId: createExecutionDto.function_id,
                sessionId: createExecutionDto.session_id,
                userId: createExecutionDto.user_id,
                code: createExecutionDto.code,
                inputParams: createExecutionDto.input_params,
                stdout: createExecutionDto.stdout,
                stderr: createExecutionDto.stderr,
                exitCode: createExecutionDto.exit_code,
                executionTimeMs: createExecutionDto.execution_time_ms,
                libraries: createExecutionDto.libraries,
            },
        });
    }

    async findAll(sessionId?: string, functionId?: string): Promise<Execution[]> {
        const where: any = {};
        if (sessionId) where.sessionId = sessionId;
        if (functionId) where.functionId = functionId;

        return this.prisma.execution.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Execution | null> {
        return this.prisma.execution.findUnique({
            where: { id },
        });
    }
}
