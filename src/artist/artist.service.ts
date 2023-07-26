import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import {
  checkItemExistence,
  removeItemFromCollections,
} from 'src/utils/validation';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import Artist from './models/artist.model';

const ARTIST = 'Artist';
const ARTIST_ID_KEY = 'artistId';

@Injectable()
export class ArtistService {
  artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    checkItemExistence(this.artists, id, ARTIST);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    checkItemExistence(this.artists, id, ARTIST);
    const existingArtist = this.artists.find((artist) => artist.id === id);
    for (const key in existingArtist) {
      if (updateArtistDto.grammy === false) {
        existingArtist.grammy = updateArtistDto.grammy;
      } else if (updateArtistDto[key]) {
        existingArtist[key] = updateArtistDto[key];
      }
    }
    return existingArtist;
  }

  remove(id: string) {
    const existingArtistId = this.artists.findIndex(
      (artist) => artist.id === id,
    );
    checkItemExistence(this.artists, id, ARTIST);
    this.artists.splice(existingArtistId, 1);
    removeItemFromCollections(
      [this.trackService.tracks, this.albumService.albums],
      ARTIST_ID_KEY,
      id,
    );
  }
}
