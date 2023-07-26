import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import {
  checkItemExistence,
  checkItemValidation,
  removeItemFromCollections,
} from 'src/utils/validation';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import AlbumEntity from './models/album.model';

const ALBUM = 'Album';
const ARTIST_ID_KEY = 'artistId';
const ALBUM_ID_KEY = 'albumId';

@Injectable()
export class AlbumService {
  albums: AlbumEntity[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    checkItemExistence(this.albums, id, ALBUM);
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new AlbumEntity(createAlbumDto);

    if (newAlbum.artistId !== null) {
      checkItemValidation(
        this.artistService.artists,
        newAlbum.artistId,
        ARTIST_ID_KEY,
      );
    }

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    checkItemExistence(this.albums, id, ALBUM);
    const existingAlbum = this.albums.find((album) => album.id === id);
    for (const key in existingAlbum) {
      if (updateAlbumDto[key]) {
        if (key === ARTIST_ID_KEY) {
          const artistId = updateAlbumDto[key];

          checkItemValidation(
            this.artistService.artists,
            artistId,
            ARTIST_ID_KEY,
          );
        }
        existingAlbum[key] = updateAlbumDto[key];
      }
    }
    return existingAlbum;
  }

  remove(id: string) {
    const existingAlbumId = this.albums.findIndex((album) => album.id === id);
    checkItemExistence(this.albums, id, ALBUM);
    this.albums.splice(existingAlbumId, 1);
    removeItemFromCollections([this.trackService.tracks], ALBUM_ID_KEY, id);
  }
}
