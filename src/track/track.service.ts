import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { checkItemExistence, checkItemValidation } from 'src/utils/validation';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import TrackEntity from './models/track.model';

const TRACK = 'Track';
const ARTIST_ID_KEY = 'artistId';
const ALBUM_ID_KEY = 'albumId';

@Injectable()
export class TrackService {
  tracks: TrackEntity[] = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    checkItemExistence(this.tracks, id, TRACK);
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new TrackEntity(createTrackDto);

    if (newTrack.albumId !== null) {
      checkItemValidation(
        this.albumService.albums,
        newTrack.albumId,
        ALBUM_ID_KEY,
      );
    }
    if (newTrack.artistId !== null) {
      checkItemExistence(
        this.artistService.artists,
        newTrack.artistId,
        ARTIST_ID_KEY,
      );
    }

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    checkItemExistence(this.tracks, id, TRACK);
    const existingTrack = this.tracks.find((track) => track.id === id);
    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === ARTIST_ID_KEY) {
          const artistId = updateTrackDto[key];

          checkItemValidation(
            this.artistService.artists,
            artistId,
            ARTIST_ID_KEY,
          );
        } else if (key === ALBUM_ID_KEY) {
          const albumId = updateTrackDto[key];

          checkItemExistence(this.albumService.albums, albumId, ALBUM_ID_KEY);
        }

        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);
    checkItemExistence(this.tracks, id, TRACK);
    this.tracks.splice(existingTrackId, 1);
  }
}
