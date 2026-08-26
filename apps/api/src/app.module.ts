import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchGateway } from './match.gateway';
import { DemoController } from './demo.controller';

@Module({ controllers: [MatchController, DemoController], providers: [PrismaService, MatchService, MatchGateway] })
export class AppModule {}
