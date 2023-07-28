import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './createArtist.dto';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
