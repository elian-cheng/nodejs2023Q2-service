import { Injectable } from '@nestjs/common';
import { checkItemExistence, checkValidId } from 'src/utils/helpers';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import Track from './models/track.model';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    checkItemExistence(this.tracks, id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track(createTrackDto);
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    checkItemExistence(this.tracks, id);
    const existingTrack = this.tracks.find((track) => track.id === id);
    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === 'artistId' || key === 'albumId') {
          checkValidId(updateTrackDto[key]);
        }
        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);
    checkItemExistence(this.tracks, id);
    this.tracks.splice(existingTrackId, 1);
  }
}
