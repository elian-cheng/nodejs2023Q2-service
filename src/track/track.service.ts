import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { ModelIds, ModelNames } from 'src/utils/constants';
import { checkItemExistence, checkValidId } from 'src/utils/validation';
import { CreateTrackDto } from './dto/createTrack.dto';
import { UpdateTrackDto } from './dto/updateTrack.dto';
import Track from './models/track.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(trackId: string) {
    await checkItemExistence(this.trackRepository, trackId, ModelNames.TRACK);
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });
    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    const createdTrack = this.trackRepository.create(createTrackDto);

    if (createdTrack.albumId !== null) {
      await this.albumService.checkAlbumExistence(createdTrack.albumId);
    }
    if (createdTrack.artistId !== null) {
      await this.artistService.checkArtistExistence(createdTrack.artistId);
    }

    const newTrack = await this.trackRepository.save(createdTrack);

    return newTrack;
  }

  async update(trackId: string, updateTrackDto: UpdateTrackDto) {
    await checkItemExistence(this.trackRepository, trackId, ModelNames.TRACK);

    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });

    for (const key in track) {
      if (updateTrackDto[key]) {
        if (key === ModelIds.ARTIST_ID) {
          const artistId = updateTrackDto[key];
          checkValidId(artistId);
          await this.artistService.checkArtistExistence(artistId);
        } else if (key === ModelIds.ALBUM_ID) {
          const albumId = updateTrackDto[key];
          checkValidId(albumId);
          await this.albumService.checkAlbumExistence(albumId);
        }

        track[key] = updateTrackDto[key];
      }
    }

    const updatedTrack = await this.trackRepository.save(track);

    return updatedTrack;
  }

  async remove(trackId: string) {
    await checkItemExistence(this.trackRepository, trackId, ModelNames.TRACK);
    await this.trackRepository.delete(trackId);
  }

  async getTracksById(tracksIdsArray: string[]) {
    const tracksArray = [];

    tracksIdsArray.forEach(async (trackId) => {
      const track = await this.trackRepository.find({
        where: { id: trackId },
      })[0];
      tracksArray.push(track);
    });

    return tracksArray;
  }

  async checkTrackExistence(trackId: string, isFavs = false) {
    await checkItemExistence(
      this.trackRepository,
      trackId,
      ModelNames.TRACK,
      isFavs,
    );
  }
}
