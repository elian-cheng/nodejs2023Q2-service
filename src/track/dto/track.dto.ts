import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { responseOnError, IsStringOrNull } from 'src/utils/validation';

export class TrackDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsStringOrNull({ message: responseOnError('artistId') })
  artistId: string | null;

  @IsStringOrNull({ message: responseOnError('albumId') })
  albumId: string | null;

  @IsInt()
  duration: number;
}
