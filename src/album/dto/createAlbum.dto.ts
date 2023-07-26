import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly year: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly artistId: string;
}
