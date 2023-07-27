import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { ModelNames, ModelIds } from 'src/utils/constants';
import {
  checkItemExistence,
  checkItemValidation,
  removeItemFromCollections,
  removeItemFromFavorites,
} from 'src/utils/validation';
import { CreateAlbumDto } from './dto/createAlbum.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import Album from './models/album.model';

@Injectable()
export class AlbumService {
  albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    checkItemExistence(this.albums, id, ModelNames.ALBUM);
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album(createAlbumDto);

    if (newAlbum.artistId !== null) {
      checkItemValidation(
        this.artistService.artists,
        newAlbum.artistId,
        ModelIds.ARTIST_ID,
      );
    }

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    checkItemExistence(this.albums, id, ModelNames.ALBUM);

    const existingAlbum = this.albums.find((album) => album.id === id);

    for (const key in existingAlbum) {
      if (updateAlbumDto[key]) {
        if (key === ModelIds.ARTIST_ID) {
          const artistId = updateAlbumDto[key];

          checkItemValidation(
            this.artistService.artists,
            artistId,
            ModelIds.ARTIST_ID,
          );
        }
        existingAlbum[key] = updateAlbumDto[key];
      }
    }

    return existingAlbum;
  }

  remove(id: string) {
    const existingAlbumId = this.albums.findIndex((album) => album.id === id);

    checkItemExistence(this.albums, id, ModelNames.ALBUM);

    this.albums.splice(existingAlbumId, 1);

    removeItemFromCollections(
      [this.trackService.tracks],
      ModelIds.ALBUM_ID,
      id,
    );

    removeItemFromFavorites(
      this.favoritesService.favorites.albums,
      id,
      ModelIds.ALBUM_ID,
    );
  }

  getAlbumsById(albumsIdsArray: string[]) {
    const albumsArray = [];

    albumsIdsArray.forEach((albumId) => {
      const album = this.albums.filter((album) => album.id === albumId)[0];
      albumsArray.push(album);
    });

    return albumsArray;
  }
}
