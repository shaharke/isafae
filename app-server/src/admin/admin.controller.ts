import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Query,
    Body,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Sessions Endpoints
    @Get('sessions')
    async getSessions(
        @Query('_end') end: string,
        @Query('_start') start: string,
        @Query('_sort') sort: string,
        @Query('_order') order: string,
        @Query() filter: any,
        @Res() res: FastifyReply,
    ) {
        const startNum = parseInt(start) || 0;
        const endNum = parseInt(end) || 10;
        const perPage = endNum - startNum;
        const page = Math.floor(startNum / perPage) + 1;

        const { data, total } = await this.adminService.getSessions(page, perPage, sort, order, filter);

        res.header('Content-Range', `sessions ${start}-${end}/${total}`);
        res.header('Access-Control-Expose-Headers', 'Content-Range');
        return res.status(HttpStatus.OK).send(data);
    }

    @Get('sessions/:id')
    async getSession(@Param('id') id: string) {
        return this.adminService.getSession(id);
    }

    @Post('sessions')
    async createSession(@Body() data: any) {
        return this.adminService.createSession(data);
    }

    @Put('sessions/:id')
    async updateSession(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateSession(id, data);
    }

    @Delete('sessions/:id')
    async deleteSession(@Param('id') id: string) {
        return this.adminService.deleteSession(id);
    }

    // Prompts Endpoints
    @Get('prompts')
    async getPrompts(
        @Query('_end') end: string,
        @Query('_start') start: string,
        @Query('_sort') sort: string,
        @Query('_order') order: string,
        @Query() filter: any,
        @Res() res: FastifyReply,
    ) {
        const startNum = parseInt(start) || 0;
        const endNum = parseInt(end) || 10;
        const perPage = endNum - startNum;
        const page = Math.floor(startNum / perPage) + 1;

        const { data, total } = await this.adminService.getPrompts(page, perPage, sort, order, filter);

        res.header('Content-Range', `prompts ${start}-${end}/${total}`);
        res.header('Access-Control-Expose-Headers', 'Content-Range');
        return res.status(HttpStatus.OK).send(data);
    }

    @Get('prompts/:id')
    async getPrompt(@Param('id') id: string) {
        return this.adminService.getPrompt(id);
    }

    @Post('prompts')
    async createPrompt(@Body() data: any) {
        return this.adminService.createPrompt(data);
    }

    @Put('prompts/:id')
    async updatePrompt(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updatePrompt(id, data);
    }

    @Delete('prompts/:id')
    async deletePrompt(@Param('id') id: string) {
        return this.adminService.deletePrompt(id);
    }

    // Functions Endpoints
    @Get('functions')
    async getFunctions(
        @Query('_end') end: string,
        @Query('_start') start: string,
        @Query('_sort') sort: string,
        @Query('_order') order: string,
        @Query() filter: any,
        @Res() res: FastifyReply,
    ) {
        const startNum = parseInt(start) || 0;
        const endNum = parseInt(end) || 10;
        const perPage = endNum - startNum;
        const page = Math.floor(startNum / perPage) + 1;

        const { data, total } = await this.adminService.getFunctions(page, perPage, sort, order, filter);

        res.header('Content-Range', `functions ${start}-${end}/${total}`);
        res.header('Access-Control-Expose-Headers', 'Content-Range');
        return res.status(HttpStatus.OK).send(data);
    }

    @Get('functions/:id')
    async getFunction(@Param('id') id: string) {
        return this.adminService.getFunction(id);
    }

    @Post('functions')
    async createFunction(@Body() data: any) {
        return this.adminService.createFunction(data);
    }

    @Put('functions/:id')
    async updateFunction(@Param('id') id: string, @Body() data: any) {
        return this.adminService.updateFunction(id, data);
    }

    @Delete('functions/:id')
    async deleteFunction(@Param('id') id: string) {
        return this.adminService.deleteFunction(id);
    }

    // Executions Endpoints (Read-only)
    @Get('executions')
    async getExecutions(
        @Query('_end') end: string,
        @Query('_start') start: string,
        @Query('_sort') sort: string,
        @Query('_order') order: string,
        @Query() filter: any,
        @Res() res: FastifyReply,
    ) {
        const startNum = parseInt(start) || 0;
        const endNum = parseInt(end) || 10;
        const perPage = endNum - startNum;
        const page = Math.floor(startNum / perPage) + 1;

        const { data, total } = await this.adminService.getExecutions(page, perPage, sort, order, filter);

        res.header('Content-Range', `executions ${start}-${end}/${total}`);
        res.header('Access-Control-Expose-Headers', 'Content-Range');
        return res.status(HttpStatus.OK).send(data);
    }

    @Get('executions/:id')
    async getExecution(@Param('id') id: string) {
        return this.adminService.getExecution(id);
    }
}
