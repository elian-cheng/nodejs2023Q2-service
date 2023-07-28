import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly duration: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly artistId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly albumId: string;
}
