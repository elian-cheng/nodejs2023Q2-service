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
import { IFavorites } from './models/favs.model';

@Injectable()
export class FavsService {
  favs: IFavorites = {
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
    const favsResponse: {
      artists: Artist[] | undefined[];
      albums: Album[] | undefined[];
      tracks: Track[] | undefined[];
    } = {
      artists: [],
      albums: [],
      tracks: [],
    };

    favsResponse.artists = this.artistService.getArtistsById(this.favs.artists);
    favsResponse.albums = this.albumService.getAlbumsById(this.favs.albums);
    favsResponse.tracks = this.trackService.getTracksById(this.favs.tracks);

    return favsResponse;
  }

  addArtistToFavs(id: string) {
    checkItemExistence(this.artistService.artists, id, ModelNames.ARTIST, true);
    this.favs.artists.push(id);
    return responseOnSuccess(ModelNames.ARTIST, id);
  }

  addAlbumsToFavs(id: string) {
    checkItemExistence(this.albumService.albums, id, ModelNames.ALBUM, true);
    this.favs.albums.push(id);
    return responseOnSuccess(ModelNames.ALBUM, id);
  }

  addTracksToFavs(id: string) {
    checkItemExistence(this.trackService.tracks, id, ModelNames.TRACK, true);
    this.favs.tracks.push(id);
    return responseOnSuccess(ModelNames.TRACK, id);
  }

  removeTrackFromFavs(id: string) {
    removeItemFromFavorites(this.favs.tracks, id, ModelIds.TRACK_ID, true);
  }

  removeArtistFromFavs(id: string) {
    removeItemFromFavorites(this.favs.artists, id, ModelIds.ARTIST_ID, true);
  }

  removeAlbumFromFavs(id: string) {
    removeItemFromFavorites(this.favs.albums, id, ModelIds.ALBUM_ID, true);
  }
}
