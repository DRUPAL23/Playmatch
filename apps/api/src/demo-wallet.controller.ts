import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('demo/wallet')
export class DemoWalletController {
  constructor(private readonly prisma: PrismaService) {}
  @Get(':id')
  async get(@Param('id') id: string) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ id }, { phone: id }] } });
    if (!user) return { error: 'Player not found' };
    const wallet = await this.prisma.wallet.findUnique({ where: { userId_currency: { userId: user.id, currency: 'KES' } } });
    return { userId: user.id, displayName: user.displayName, currency: 'KES', availableMinor: (wallet?.availableMinor ?? 0n).toString(), lockedMinor: (wallet?.lockedMinor ?? 0n).toString() };
  }
}
