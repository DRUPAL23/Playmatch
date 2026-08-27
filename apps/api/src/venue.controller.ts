import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTableDto, CreateVenueDto, UpdateTableDto } from './venue.dto';
import { VenueService } from './venue.service';

@Controller('venues')
export class VenueController {
  constructor(private readonly venues: VenueService) {}
  @Get() list() { return this.venues.list(); }
  @Post() create(@Body() dto: CreateVenueDto) { return this.venues.create(dto); }
  @Get(':id/tables') tables(@Param('id') id: string) { return this.venues.tables(id); }
  @Post('tables') createTable(@Body() dto: CreateTableDto) { return this.venues.createTable(dto); }
  @Patch('tables/:id') updateTable(@Param('id') id: string, @Body() dto: UpdateTableDto) { return this.venues.updateTable(id, dto); }
}
