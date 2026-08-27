import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString() name!: string;
  @IsOptional() latitude?: number;
  @IsOptional() longitude?: number;
}

export class CreateTableDto {
  @IsString() venueId!: string;
  @IsString() label!: string;
  @IsOptional() @IsString() gameType?: string;
}

export class UpdateTableDto {
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsString() label?: string;
}

export class CheckInDto {
  @IsString() userId!: string;
}
