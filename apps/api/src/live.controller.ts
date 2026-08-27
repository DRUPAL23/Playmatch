import { Body, Controller, Param, Post } from '@nestjs/common';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { LiveService } from './live.service';

class EventDto { @IsOptional() @IsString() actorId?: string; @IsString() type!: string; @IsObject() payload!: Record<string, unknown>; }
class DisputeDto { @IsString() openedBy!: string; @IsString() reason!: string; }
class CheckInDto { @IsString() userId!: string; }

@Controller('matches')
export class LiveController {
  constructor(private readonly live: LiveService) {}
  @Post(':id/check-in') checkIn(@Param('id') id: string, @Body() dto: CheckInDto) { return this.live.checkIn(id, dto.userId); }
  @Post(':id/events') event(@Param('id') id: string, @Body() dto: EventDto) { return this.live.event(id, dto.actorId, dto.type, dto.payload); }
  @Post(':id/dispute') dispute(@Param('id') id: string, @Body() dto: DisputeDto) { return this.live.dispute(id, dto.openedBy, dto.reason); }
}
