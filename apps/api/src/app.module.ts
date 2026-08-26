import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchGateway } from './match.gateway';
import { DemoController } from './demo.controller';
import { DemoWalletController } from './demo-wallet.controller';

@Module({ controllers: [MatchController, DemoController, DemoWalletController], providers: [PrismaService, MatchService, MatchGateway] })
export class AppModule {}
