import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ModelNames } from 'src/utils/constants';
import { checkItemExistence } from 'src/utils/validation';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import Artist from './models/artist.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(artistId: string) {
    await checkItemExistence(
      this.artistRepository,
      artistId,
      ModelNames.ARTIST,
    );

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    const createdAlbum = this.artistRepository.create(createArtistDto);

    const newArtist = await this.artistRepository.save(createdAlbum);
    return newArtist;
  }

  async update(artistId: string, updateArtistDto: UpdateArtistDto) {
    await checkItemExistence(
      this.artistRepository,
      artistId,
      ModelNames.ARTIST,
    );

    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    for (const key in artist) {
      if (updateArtistDto.grammy === false) {
        artist.grammy = updateArtistDto.grammy;
      } else if (updateArtistDto[key]) {
        artist[key] = updateArtistDto[key];
      }
    }

    const updatedArtist = await this.artistRepository.save(artist);

    return updatedArtist;
  }

  async remove(artistId: string) {
    await checkItemExistence(
      this.artistRepository,
      artistId,
      ModelNames.ARTIST,
    );
    await this.artistRepository.delete(artistId);
  }

  async getArtistsById(artistIdsArray: string[]) {
    const artistsArray = [];

    artistIdsArray.forEach(async (artistId) => {
      const artist = await this.artistRepository.find({
        where: { id: artistId },
      })[0];
      artistsArray.push(artist);
    });

    return artistsArray;
  }

  async checkArtistExistence(artistId: string, isFavs = false) {
    await checkItemExistence(
      this.artistRepository,
      artistId,
      ModelNames.ARTIST,
      isFavs,
    );
  }
}
