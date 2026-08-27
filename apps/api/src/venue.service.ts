import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  list() { return this.prisma.venue.findMany({ include: { tables: true }, orderBy: { name: 'asc' } }); }

  async create(dto: { name: string; latitude?: number; longitude?: number }) {
    return this.prisma.venue.create({ data: { name: dto.name, latitude: dto.latitude, longitude: dto.longitude } });
  }

  async tables(venueId: string) {
    const venue = await this.prisma.venue.findUnique({ where: { id: venueId } });
    if (!venue) throw new NotFoundException('Venue not found');
    return this.prisma.gameTable.findMany({ where: { venueId }, include: { venue: true }, orderBy: { label: 'asc' } });
  }

  async createTable(dto: { venueId: string; label: string; gameType?: string }) {
    const venue = await this.prisma.venue.findUnique({ where: { id: dto.venueId } });
    if (!venue) throw new NotFoundException('Venue not found');
    return this.prisma.gameTable.create({ data: { venueId: dto.venueId, label: dto.label, gameType: dto.gameType ?? 'POOL_8_BALL' } });
  }

  async updateTable(id: string, dto: { active?: boolean; label?: string }) {
    const table = await this.prisma.gameTable.findUnique({ where: { id } });
    if (!table) throw new NotFoundException('Table not found');
    if (dto.active === false) {
      const activeMatch = await this.prisma.match.findFirst({ where: { tableId: id, state: { in: ['READY', 'LIVE', 'RESULT_PENDING'] } } });
      if (activeMatch) throw new BadRequestException('Cannot deactivate a table with an active match.');
    }
    return this.prisma.gameTable.update({ where: { id }, data: dto });
  }
}
