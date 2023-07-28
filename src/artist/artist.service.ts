import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ModelIds, ModelNames } from 'src/utils/constants';
import {
  checkItemExistence,
  removeItemFromCollections,
  removeItemFromFavorites,
} from 'src/utils/validation';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import Artist from './models/artist.model';

@Injectable()
export class ArtistService {
  artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    checkItemExistence(this.artists, id, ModelNames.ARTIST);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    checkItemExistence(this.artists, id, ModelNames.ARTIST);

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

    checkItemExistence(this.artists, id, ModelNames.ARTIST);

    this.artists.splice(existingArtistId, 1);

    removeItemFromCollections(
      [this.trackService.tracks, this.albumService.albums],
      ModelIds.ARTIST_ID,
      id,
    );

    removeItemFromFavorites(
      this.favsService.favs.artists,
      id,
      ModelIds.ARTIST_ID,
    );
  }

  getArtistsById(artistIdsArray: string[]) {
    const artistsArray = [];

    artistIdsArray.forEach((artistId) => {
      const artist = this.artists.filter((artist) => artist.id === artistId)[0];
      artistsArray.push(artist);
    });

    return artistsArray;
  }
}
