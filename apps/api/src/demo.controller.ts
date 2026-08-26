import { Controller, ForbiddenException, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('bootstrap')
  async bootstrap() {
    if (process.env.DEMO_MODE !== 'true' || process.env.REAL_MONEY_ENABLED === 'true') throw new ForbiddenException('Demo bootstrap disabled.');
    const [alice, bob] = await Promise.all([
      this.prisma.user.upsert({ where: { phone: 'demo-alice' }, update: {}, create: { phone: 'demo-alice', displayName: 'Alice' } }),
      this.prisma.user.upsert({ where: { phone: 'demo-bob' }, update: {}, create: { phone: 'demo-bob', displayName: 'Bob' } }),
    ]);
    for (const user of [alice, bob]) await this.prisma.wallet.upsert({ where: { userId_currency: { userId: user.id, currency: 'KES' } }, update: {}, create: { userId: user.id, availableMinor: 100000n, currency: 'KES' } });
    const venue = await this.prisma.venue.create({ data: { name: `Demo Pool Arena ${Date.now()}`, latitude: -1.286389, longitude: 36.817223, tables: { create: [{ label: 'T01', gameType: 'POOL_8_BALL' }, { label: 'T02', gameType: 'POOL_9_BALL' }] } });
    return { venue, users: [alice, bob], demoBalanceMinor: 100000 };
  }
}
