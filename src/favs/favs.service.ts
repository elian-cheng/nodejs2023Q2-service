import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import Album from 'src/album/models/album.model';
import { ArtistService } from 'src/artist/artist.service';
import Artist from 'src/artist/models/artist.model';
import Track from 'src/track/models/track.model';
import { TrackService } from 'src/track/track.service';
import { ModelNames } from 'src/utils/constants';
import { responseOnSuccess } from 'src/utils/validation';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import FavsAlbums from './models/favsAlbums.model';
import FavsArtists from './models/favsArtists.model';
import FavsTracks from './models/favsTracks.model';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(FavsArtists)
    private favsArtistsRepository: Repository<FavsArtists>,
    @InjectRepository(FavsAlbums)
    private favsAlbumsRepository: Repository<FavsAlbums>,
    @InjectRepository(FavsTracks)
    private favsTracksRepository: Repository<FavsTracks>,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async findAll() {
    const favsResponse: {
      artists: Artist[] | undefined[];
      albums: Album[] | undefined[];
      tracks: Track[] | undefined[];
    } = {
      artists: [],
      albums: [],
      tracks: [],
    };

    const artists = await this.favsArtistsRepository.find();
    const albums = await this.favsAlbumsRepository.find();
    const tracks = await this.favsTracksRepository.find();

    favsResponse.artists = artists.map((el) => el.artist);
    favsResponse.albums = albums.map((el) => el.album);
    favsResponse.tracks = tracks.map((el) => el.track);

    return favsResponse;
  }

  async addArtistToFavs(id: string) {
    await this.artistService.checkArtistExistence(id, true);
    const artist = await this.artistService.findOne(id);
    const createdFavsArtist = this.favsArtistsRepository.create({ artist });
    await this.favsArtistsRepository.save(createdFavsArtist);
    return responseOnSuccess(ModelNames.ARTIST, id);
  }

  async addAlbumsToFavs(id: string) {
    await this.albumService.checkAlbumExistence(id, true);
    const album = await this.albumService.findOne(id);
    const createdFavsAlbum = this.favsAlbumsRepository.create({ album });
    await this.favsAlbumsRepository.save(createdFavsAlbum);
    return responseOnSuccess(ModelNames.ALBUM, id);
  }

  async addTracksToFavs(id: string) {
    await this.trackService.checkTrackExistence(id, true);

    const track = await this.trackService.findOne(id);
    const createdFavsTrack = this.favsTracksRepository.create({ track });
    await this.favsTracksRepository.save(createdFavsTrack);
    return responseOnSuccess(ModelNames.TRACK, id);
  }

  async removeTrackFromFavs(id: string) {
    await this.trackService.checkTrackExistence(id, true);
    const favTrackId = await this.findTrackInFavs(id);
    await this.favsTracksRepository.delete(favTrackId);
  }

  async removeArtistFromFavs(id: string) {
    await this.artistService.checkArtistExistence(id, true);
    const favArtistId = await this.findArtistInFavs(id);
    await this.favsArtistsRepository.delete(favArtistId);
  }

  async removeAlbumFromFavs(id: string) {
    await this.albumService.checkAlbumExistence(id, true);
    const favAlbumId = await this.findAlbumInFavs(id);
    await this.favsAlbumsRepository.delete(favAlbumId);
  }

  async findArtistInFavs(id: string) {
    const favArtists = await this.favsArtistsRepository.findOne({
      where: { artist: { id: id } },
    });
    return favArtists.id;
  }

  async findAlbumInFavs(id: string) {
    const favAlbum = await this.favsAlbumsRepository.findOne({
      where: { album: { id: id } },
    });
    return favAlbum.id;
  }

  async findTrackInFavs(id: string) {
    const favTrack = await this.favsTracksRepository.findOne({
      where: { track: { id: id } },
    });
    return favTrack.id;
  }
}
