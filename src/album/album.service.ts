import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { ModelIds, ModelNames } from 'src/utils/constants';
import { checkItemExistence, checkValidId } from 'src/utils/validation';
import { CreateAlbumDto } from './dto/album.dto';
import { UpdateAlbumDto } from './dto/updateAlbum.dto';
import Album from './models/album.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => FavsService))
    private favsService: FavsService,
  ) {}

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(albumId: string) {
    await checkItemExistence(this.albumRepository, albumId, ModelNames.ALBUM);
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    const createdAlbum = this.albumRepository.create(createAlbumDto);

    if (createdAlbum.artistId !== null) {
      await this.artistService.checkArtistExistence(createdAlbum.artistId);
    }
    const newAlbum = await this.albumRepository.save(createdAlbum);
    return newAlbum;
  }

  async update(albumId: string, updateAlbumDto: UpdateAlbumDto) {
    await checkItemExistence(this.albumRepository, albumId, ModelNames.ALBUM);
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });

    for (const key in album) {
      if (updateAlbumDto[key]) {
        if (key === ModelIds.ARTIST_ID) {
          const artistId = updateAlbumDto[key];
          checkValidId(artistId);
          await this.artistService.checkArtistExistence(artistId);
        }
        album[key] = updateAlbumDto[key];
      }
    }

    const updatedAlbum = await this.albumRepository.save(album);

    return updatedAlbum;
  }

  async remove(albumId: string) {
    await checkItemExistence(this.albumRepository, albumId, ModelNames.ALBUM);
    await this.albumRepository.delete(albumId);
  }

  async getAlbumsById(albumsIdsArray: string[]) {
    const albumsArray = [];

    albumsIdsArray.forEach(async (albumId) => {
      const album = await this.albumRepository.find({
        where: { id: albumId },
      })[0];
      albumsArray.push(album);
    });

    return albumsArray;
  }

  async checkAlbumExistence(albumId: string, isFavs = false) {
    await checkItemExistence(
      this.albumRepository,
      albumId,
      ModelNames.ALBUM,
      isFavs,
    );
  }
}
