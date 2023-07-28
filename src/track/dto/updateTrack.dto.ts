import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackDto } from './createTrack.dto';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
