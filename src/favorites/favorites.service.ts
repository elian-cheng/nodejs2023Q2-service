import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import Album from 'src/album/models/album.model';
import { ArtistService } from 'src/artist/artist.service';
import Artist from 'src/artist/models/artist.model';
import Track from 'src/track/models/track.model';
import { TrackService } from 'src/track/track.service';
import { ModelNames, ModelIds } from 'src/utils/constants';
import {
  checkItemExistence,
  removeItemFromFavorites,
  responseOnSuccess,
} from 'src/utils/validation';
import { IFavorites } from './models/favorites.model';

@Injectable()
export class FavoritesService {
  favorites: IFavorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  findAll() {
    const favoritesResponse: {
      artists: Artist[] | undefined[];
      albums: Album[] | undefined[];
      tracks: Track[] | undefined[];
    } = {
      artists: [],
      albums: [],
      tracks: [],
    };

    favoritesResponse.artists = this.artistService.getArtistsById(
      this.favorites.artists,
    );
    favoritesResponse.albums = this.albumService.getAlbumsById(
      this.favorites.albums,
    );
    favoritesResponse.tracks = this.trackService.getTracksById(
      this.favorites.tracks,
    );

    return favoritesResponse;
  }

  addArtistToFavorites(id: string) {
    checkItemExistence(this.artistService.artists, id, ModelNames.ARTIST, true);
    this.favorites.artists.push(id);
    return responseOnSuccess(ModelNames.ARTIST, id);
  }

  addAlbumsToFavorites(id: string) {
    checkItemExistence(this.albumService.albums, id, ModelNames.ALBUM, true);
    this.favorites.albums.push(id);
    return responseOnSuccess(ModelNames.ALBUM, id);
  }

  addTracksToFavorites(id: string) {
    checkItemExistence(this.trackService.tracks, id, ModelNames.TRACK, true);
    this.favorites.tracks.push(id);
    return responseOnSuccess(ModelNames.TRACK, id);
  }

  removeTrackFromFavorites(id: string) {
    removeItemFromFavorites(this.favorites.tracks, id, ModelIds.TRACK_ID, true);
  }

  removeArtistFromFavorites(id: string) {
    removeItemFromFavorites(
      this.favorites.artists,
      id,
      ModelIds.ARTIST_ID,
      true,
    );
  }

  removeAlbumFromFavorites(id: string) {
    removeItemFromFavorites(this.favorites.albums, id, ModelIds.ALBUM_ID, true);
  }
}
