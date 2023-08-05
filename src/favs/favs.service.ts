import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { IAlbumData, prepareAlbumResponse } from 'src/album/models/album.model';
import {
  IArtistData,
  prepareArtistResponse,
} from 'src/artist/models/artist.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITrackData, prepareTrackResponse } from 'src/track/models/track.model';
import { PRISMA_ERROR } from 'src/utils/constants';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(): Promise<{
    artists: IArtistData | IArtistData[];
    albums: IAlbumData | IAlbumData[];
    tracks: ITrackData | ITrackData[];
  }> {
    const artists = await this.prisma.artist.findMany({
      where: { favorite: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { favorite: true },
    });
    const tracks = await this.prisma.track.findMany({
      where: { favorite: true },
    });

    return {
      artists: prepareArtistResponse(artists),
      albums: prepareAlbumResponse(albums),
      tracks: prepareTrackResponse(tracks),
    };
  }

  async addFavTrack(trackId: string): Promise<ITrackData | ITrackData[]> {
    try {
      const response = await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: true },
      });

      return prepareTrackResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavTrack(trackId: string) {
    try {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }

  async addFavAlbum(albumId: string): Promise<IAlbumData | IAlbumData[]> {
    try {
      const response = await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: true },
      });

      return prepareAlbumResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavAlbum(albumId: string) {
    try {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }

  async addFavArtist(artistId: string): Promise<IArtistData | IArtistData[]> {
    try {
      const response = await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: true },
      });

      return prepareArtistResponse(response);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new UnprocessableEntityException();
        }
      }
    }
  }

  async deleteFavArtist(artistId: string) {
    try {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: false },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }
}
