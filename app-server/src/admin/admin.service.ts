import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    // Sessions CRUD
    async getSessions(page: number, perPage: number, sort?: string, order?: string, filter?: any) {
        const skip = (page - 1) * perPage;
        const orderBy: any = sort ? { [sort]: order === 'DESC' ? 'desc' : 'asc' } : { createdAt: 'desc' };

        const where: Prisma.SessionWhereInput = {};
        if (filter?.status) {
            where.status = filter.status;
        }
        if (filter?.q) {
            where.id = { contains: filter.q };
        }

        const [data, total] = await Promise.all([
            this.prisma.session.findMany({
                skip,
                take: perPage,
                orderBy,
                where,
            }),
            this.prisma.session.count({ where }),
        ]);

        return { data, total };
    }

    async getSession(id: string) {
        return this.prisma.session.findUnique({ where: { id } });
    }

    async createSession(data: Prisma.SessionCreateInput) {
        return this.prisma.session.create({ data });
    }

    async updateSession(id: string, data: Prisma.SessionUpdateInput) {
        return this.prisma.session.update({ where: { id }, data });
    }

    async deleteSession(id: string) {
        return this.prisma.session.delete({ where: { id } });
    }

    // Prompts CRUD
    async getPrompts(page: number, perPage: number, sort?: string, order?: string, filter?: any) {
        const skip = (page - 1) * perPage;
        const orderBy: any = sort ? { [sort]: order === 'DESC' ? 'desc' : 'asc' } : { createdAt: 'desc' };

        const where: Prisma.PromptWhereInput = {};
        if (filter?.q) {
            where.OR = [
                { title: { contains: filter.q, mode: 'insensitive' } },
                { description: { contains: filter.q, mode: 'insensitive' } },
            ];
        }
        if (filter?.tags) {
            where.tags = { hasSome: Array.isArray(filter.tags) ? filter.tags : [filter.tags] };
        }

        const [data, total] = await Promise.all([
            this.prisma.prompt.findMany({
                skip,
                take: perPage,
                orderBy,
                where,
            }),
            this.prisma.prompt.count({ where }),
        ]);

        return { data, total };
    }

    async getPrompt(id: string) {
        return this.prisma.prompt.findUnique({
            where: { id },
            include: { functions: true },
        });
    }

    async createPrompt(data: Prisma.PromptCreateInput) {
        return this.prisma.prompt.create({ data });
    }

    async updatePrompt(id: string, data: Prisma.PromptUpdateInput) {
        return this.prisma.prompt.update({ where: { id }, data });
    }

    async deletePrompt(id: string) {
        return this.prisma.prompt.delete({ where: { id } });
    }

    // Functions CRUD
    async getFunctions(page: number, perPage: number, sort?: string, order?: string, filter?: any) {
        const skip = (page - 1) * perPage;
        const orderBy: any = sort ? { [sort]: order === 'DESC' ? 'desc' : 'asc' } : { createdAt: 'desc' };

        const where: Prisma.FunctionWhereInput = {};
        if (filter?.status) {
            where.status = filter.status;
        }
        if (filter?.lang) {
            where.lang = filter.lang;
        }
        if (filter?.promptId) {
            where.promptId = filter.promptId;
        }
        if (filter?.q) {
            where.OR = [
                { name: { contains: filter.q, mode: 'insensitive' } },
                { code: { contains: filter.q, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.function.findMany({
                skip,
                take: perPage,
                orderBy,
                where,
                include: { prompt: true },
            }),
            this.prisma.function.count({ where }),
        ]);

        return { data, total };
    }

    async getFunction(id: string) {
        return this.prisma.function.findUnique({
            where: { id },
            include: { prompt: true, executions: true },
        });
    }

    async createFunction(data: Prisma.FunctionCreateInput) {
        return this.prisma.function.create({ data });
    }

    async updateFunction(id: string, data: Prisma.FunctionUpdateInput) {
        return this.prisma.function.update({ where: { id }, data });
    }

    async deleteFunction(id: string) {
        return this.prisma.function.delete({ where: { id } });
    }

    // Executions CRUD (Read-only)
    async getExecutions(page: number, perPage: number, sort?: string, order?: string, filter?: any) {
        const skip = (page - 1) * perPage;
        const orderBy: any = sort ? { [sort]: order === 'DESC' ? 'desc' : 'asc' } : { createdAt: 'desc' };

        const where: Prisma.ExecutionWhereInput = {};
        if (filter?.functionId) {
            where.functionId = filter.functionId;
        }
        if (filter?.sessionId) {
            where.sessionId = filter.sessionId;
        }
        if (filter?.exitCode !== undefined) {
            where.exitCode = parseInt(filter.exitCode);
        }

        const [data, total] = await Promise.all([
            this.prisma.execution.findMany({
                skip,
                take: perPage,
                orderBy,
                where,
                include: { function: true, session: true },
            }),
            this.prisma.execution.count({ where }),
        ]);

        return { data, total };
    }

    async getExecution(id: string) {
        return this.prisma.execution.findUnique({
            where: { id },
            include: { function: true, session: true },
        });
    }
}
