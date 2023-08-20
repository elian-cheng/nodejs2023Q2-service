import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { responseOnError, IsStringOrNull } from 'src/utils/validation';

export class AlbumDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsStringOrNull({ message: responseOnError('artistId') })
  artistId: string | null;
}
