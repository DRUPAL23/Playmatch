import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MatchState, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { MatchGateway } from './match.gateway';

@Injectable()
export class LiveService {
  constructor(private readonly prisma: PrismaService, private readonly gateway: MatchGateway) {}

  async checkIn(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId }, include: { participants: true } });
    if (!match) throw new NotFoundException('Match not found');
    if (!match.participants.some(p => p.userId === userId)) throw new BadRequestException('Player is not a participant.');
    const event = await this.prisma.matchEvent.create({ data: { matchId, actorId: userId, type: 'PLAYER_CHECK_IN', payload: { userId } } });
    this.gateway.emitMatch(matchId, 'match:event', event);
    return event;
  }

  async event(matchId: string, actorId: string | undefined, type: string, payload: Record<string, unknown>) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId }, include: { participants: true } });
    if (!match) throw new NotFoundException('Match not found');
    if (![MatchState.READY, MatchState.LIVE, MatchState.RESULT_PENDING].includes(match.state)) throw new BadRequestException('Match is not active.');
    if (actorId && !match.participants.some(p => p.userId === actorId)) throw new BadRequestException('Actor is not a participant.');
    const event = await this.prisma.matchEvent.create({ data: { matchId, actorId, type, payload: payload as Prisma.InputJsonValue } });
    this.gateway.emitMatch(matchId, 'match:event', event);
    return event;
  }

  async dispute(matchId: string, openedBy: string, reason: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId }, include: { participants: true } });
    if (!match) throw new NotFoundException('Match not found');
    if (!match.participants.some(p => p.userId === openedBy)) throw new BadRequestException('Player is not a participant.');
    const dispute = await this.prisma.matchDispute.create({ data: { matchId, openedBy, reason, status: 'OPEN' } });
    await this.prisma.match.update({ where: { id: matchId }, data: { state: MatchState.DISPUTED, resultStatus: 'DISPUTED' } });
    this.gateway.emitMatch(matchId, 'match:disputed', dispute);
    return dispute;
  }
}
