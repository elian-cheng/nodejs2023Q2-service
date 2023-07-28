import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { ModelIds, ModelNames } from 'src/utils/constants';
import {
  checkItemExistence,
  checkItemValidation,
  removeItemFromFavorites,
} from 'src/utils/validation';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import Track from './models/track.model';

@Injectable()
export class TrackService {
  tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    checkItemExistence(this.tracks, id, ModelNames.TRACK);
    const track = this.tracks.find((track) => track.id === id);
    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track(createTrackDto);

    if (newTrack.albumId !== null) {
      checkItemValidation(
        this.albumService.albums,
        newTrack.albumId,
        ModelIds.ALBUM_ID,
      );
    }
    if (newTrack.artistId !== null) {
      checkItemValidation(
        this.artistService.artists,
        newTrack.artistId,
        ModelIds.ARTIST_ID,
      );
    }

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    checkItemExistence(this.tracks, id, ModelNames.TRACK);

    const existingTrack = this.tracks.find((track) => track.id === id);

    for (const key in existingTrack) {
      if (updateTrackDto[key]) {
        if (key === ModelIds.ARTIST_ID) {
          const artistId = updateTrackDto[key];

          checkItemValidation(
            this.artistService.artists,
            artistId,
            ModelIds.ARTIST_ID,
          );
        } else if (key === ModelIds.ALBUM_ID) {
          const albumId = updateTrackDto[key];

          checkItemValidation(
            this.albumService.albums,
            albumId,
            ModelIds.ALBUM_ID,
          );
        }

        existingTrack[key] = updateTrackDto[key];
      }
    }
    return existingTrack;
  }

  remove(id: string) {
    const existingTrackId = this.tracks.findIndex((track) => track.id === id);

    checkItemExistence(this.tracks, id, ModelNames.TRACK);

    this.tracks.splice(existingTrackId, 1);

    removeItemFromFavorites(
      this.favsService.favs.tracks,
      id,
      ModelIds.TRACK_ID,
    );
  }

  getTracksById(tracksIdsArray: string[]) {
    const tracksArray = [];

    tracksIdsArray.forEach((trackId) => {
      const track = this.tracks.filter((track) => track.id === trackId)[0];
      tracksArray.push(track);
    });

    return tracksArray;
  }
}
