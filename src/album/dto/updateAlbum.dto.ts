import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './createAlbum.dto';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
