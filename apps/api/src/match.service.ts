import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MatchState, ResultStatus, ParticipantRole, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async listOpen() {
    return this.prisma.match.findMany({ where: { state: MatchState.OPEN }, include: { participants: { include: { user: true } }, table: { include: { venue: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: { challengerId: string; stakeMinor: number; tableId?: string }) {
    if (process.env.REAL_MONEY_ENABLED === 'true') throw new BadRequestException('Real-money wagering is disabled until compliance approval.');
    if (dto.stakeMinor < 1) throw new BadRequestException('Stake must be positive.');
    const wallet = await this.prisma.wallet.findUnique({ where: { userId_currency: { userId: dto.challengerId, currency: 'KES' } } });
    if (!wallet || wallet.availableMinor < BigInt(dto.stakeMinor)) throw new BadRequestException('Insufficient demo balance.');
    return this.prisma.$transaction(async tx => {
      await tx.wallet.update({ where: { id: wallet.id }, data: { availableMinor: { decrement: BigInt(dto.stakeMinor) }, lockedMinor: { increment: BigInt(dto.stakeMinor) } } });
      const match = await tx.match.create({ data: { stakeMinor: BigInt(dto.stakeMinor), tableId: dto.tableId, state: MatchState.OPEN, participants: { create: { userId: dto.challengerId, role: ParticipantRole.CHALLENGER, stakeMinor: BigInt(dto.stakeMinor) } } }, include: { participants: true } });
      await tx.auditLog.create({ data: { actorId: dto.challengerId, action: 'MATCH_CREATED', entity: 'Match', entityId: match.id, metadata: { demo: true } } });
      return match;
    });
  }

  async accept(id: string, opponentId: string) {
    return this.prisma.$transaction(async tx => {
      const match = await tx.match.findUnique({ where: { id }, include: { participants: true } });
      if (!match) throw new NotFoundException('Match not found');
      if (match.state !== MatchState.OPEN || match.participants.some(p => p.userId === opponentId)) throw new BadRequestException('Match cannot be accepted.');
      const wallet = await tx.wallet.findUnique({ where: { userId_currency: { userId: opponentId, currency: match.currency } } });
      if (!wallet || wallet.availableMinor < match.stakeMinor) throw new BadRequestException('Insufficient demo balance.');
      await tx.wallet.update({ where: { id: wallet.id }, data: { availableMinor: { decrement: match.stakeMinor }, lockedMinor: { increment: match.stakeMinor } } });
      return tx.match.update({ where: { id }, data: { state: MatchState.READY, participants: { create: { userId: opponentId, role: ParticipantRole.OPPONENT, stakeMinor: match.stakeMinor } } }, include: { participants: true } });
    });
  }

  async start(id: string) { return this.transition(id, MatchState.READY, MatchState.LIVE); }

  async submitResult(id: string, winnerId: string) {
    return this.prisma.$transaction(async tx => {
      const match = await tx.match.findUnique({ where: { id }, include: { participants: true } });
      if (!match) throw new NotFoundException('Match not found');
      if (![MatchState.LIVE, MatchState.RESULT_PENDING].includes(match.state)) throw new BadRequestException('Match is not live.');
      if (!match.participants.some(p => p.userId === winnerId)) throw new BadRequestException('Winner is not a participant.');
      const updated = await tx.match.update({ where: { id }, data: { winnerId, state: MatchState.RESULT_CONFIRMED, resultStatus: ResultStatus.CONFIRMED } });
      await this.settle(tx, updated.id, winnerId, match.stakeMinor, match.platformFeeBps, match.participants.map(p => p.userId));
      return tx.match.findUnique({ where: { id: updated.id }, include: { participants: true } });
    });
  }

  private async settle(tx: Prisma.TransactionClient, matchId: string, winnerId: string, stake: bigint, feeBps: number, users: string[]) {
    const pool = stake * 2n; const fee = (pool * BigInt(feeBps)) / 10000n; const payout = pool - fee;
    for (const userId of users) await tx.wallet.update({ where: { userId_currency: { userId, currency: 'KES' } }, data: { lockedMinor: { decrement: stake } } });
    await tx.wallet.update({ where: { userId_currency: { userId: winnerId, currency: 'KES' } }, data: { availableMinor: { increment: payout } } });
    await tx.auditLog.create({ data: { action: 'MATCH_SETTLED', entity: 'Match', entityId: matchId, metadata: { winnerId, pool: pool.toString(), fee: fee.toString(), payout: payout.toString() } } });
  }

  private async transition(id: string, from: MatchState, to: MatchState) {
    const result = await this.prisma.match.updateMany({ where: { id, state: from }, data: { state: to } });
    if (!result.count) throw new BadRequestException(`Invalid transition ${from} -> ${to}`);
    return this.prisma.match.findUnique({ where: { id }, include: { participants: true } });
  }
}
