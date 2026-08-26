import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Controller()
class HealthController {
  @Get('/health')
  health() { return { status: 'ok', service: 'playmatch-api', realMoneyEnabled: process.env.REAL_MONEY_ENABLED === 'true' }; }
}

@Module({ controllers: [HealthController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN?.split(',') ?? false });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();