import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session, SessionStatus } from '@prisma/client';

@Injectable()
export class SessionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createSessionDto: CreateSessionDto): Promise<Session> {
        return this.prisma.session.create({
            data: {
                lang: createSessionDto.lang,
                keepTemplate: createSessionDto.keep_template,
                userId: createSessionDto.user_id,
                metadata: createSessionDto.metadata,
                status: SessionStatus.ACTIVE,
            },
        });
    }

    async findAll(): Promise<Session[]> {
        return this.prisma.session.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Session | null> {
        return this.prisma.session.findUnique({
            where: { id },
            include: { executions: true },
        });
    }

    async terminate(id: string): Promise<Session> {
        return this.prisma.session.update({
            where: { id },
            data: {
                status: SessionStatus.TERMINATED,
                terminatedAt: new Date(),
            },
        });
    }
}
