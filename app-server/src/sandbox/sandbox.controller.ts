import { Controller, Get, Post, Body } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { ExecuteCodeDto } from './dto/execute-code.dto';

@Controller('sandbox')
export class SandboxController {
    constructor(private readonly sandboxService: SandboxService) { }

    @Get('health')
    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    @Post('execute')
    async executeCode(@Body() executeCodeDto: ExecuteCodeDto) {
        return this.sandboxService.executeCode(executeCodeDto);
    }
}
