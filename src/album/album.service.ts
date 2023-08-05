import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IAlbumData, prepareAlbumResponse } from './models/album.model';
import { AlbumDTO } from './dto/album.dto';
import { PRISMA_ERROR } from 'src/utils/constants';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAlbums(): Promise<IAlbumData | IAlbumData[]> {
    const albums = await this.prisma.album.findMany();

    return prepareAlbumResponse(albums);
  }

  async getAlbum(albumId: string): Promise<IAlbumData | IAlbumData[]> {
    const response = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!response) throw new NotFoundException();

    return prepareAlbumResponse(response);
  }

  async createAlbum(dto: AlbumDTO): Promise<IAlbumData | IAlbumData[]> {
    const album = await this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId,
        favorite: false,
      },
    });

    return prepareAlbumResponse(album);
  }

  async updateAlbumInfo(
    albumId: string,
    dto: AlbumDTO,
  ): Promise<IAlbumData | IAlbumData[]> {
    const response = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!response) throw new NotFoundException();

    const updatedArtist = await this.prisma.album.update({
      where: { id: albumId },
      data: { name: dto.name, year: dto.year, artistId: dto.artistId },
    });

    return prepareAlbumResponse(updatedArtist);
  }

  async deleteAlbum(albumId: string) {
    try {
      await this.prisma.album.delete({ where: { id: albumId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }
}
