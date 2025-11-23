import { Module } from '@nestjs/common';
import { ProxyClientService } from './proxy-client.service';

@Module({
    providers: [ProxyClientService],
    exports: [ProxyClientService],
})
export class ProxyClientModule { }
