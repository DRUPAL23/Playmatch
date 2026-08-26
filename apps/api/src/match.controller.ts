import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { AcceptMatchDto, CreateMatchDto, ResultDto } from './match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matches: MatchService) {}
  @Get('open') open() { return this.matches.listOpen(); }
  @Post() create(@Body() dto: CreateMatchDto) { return this.matches.create(dto); }
  @Post(':id/accept') accept(@Param('id') id: string, @Body() dto: AcceptMatchDto) { return this.matches.accept(id, dto.opponentId); }
  @Post(':id/start') start(@Param('id') id: string) { return this.matches.start(id); }
  @Post(':id/result') result(@Param('id') id: string, @Body() dto: ResultDto) { return this.matches.submitResult(id, dto.winnerId); }
}
