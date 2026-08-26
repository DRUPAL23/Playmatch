import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMatchDto {
  @IsString() challengerId!: string;
  @IsInt() @Min(1) stakeMinor!: number;
  @IsOptional() @IsString() tableId?: string;
}

export class AcceptMatchDto { @IsString() opponentId!: string; }
export class ResultDto { @IsString() winnerId!: string; }
