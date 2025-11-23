import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, CreateSessionSchema } from './dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Post()
    async create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }

    @Get()
    async findAll() {
        return this.sessionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const session = await this.sessionsService.findOne(id);
        if (!session) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }
        return session;
    }

    @Delete(':id')
    async terminate(@Param('id') id: string) {
        try {
            return await this.sessionsService.terminate(id);
        } catch (error) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }
    }
}
