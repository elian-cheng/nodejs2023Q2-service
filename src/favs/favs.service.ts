import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IAlbumData, prepareAlbumResponse } from 'src/album/models/album.model';
import {
  IArtistData,
  prepareArtistResponse,
} from 'src/artist/models/artist.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITrackData, prepareTrackResponse } from 'src/track/models/track.model';

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
      const track = await this.prisma.track.findUnique({
        where: { id: trackId },
      });
      if (!track) {
        throw new UnprocessableEntityException(
          `Track with id ${trackId} not found`,
        );
      }

      const response = await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: true },
      });

      return prepareTrackResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteFavTrack(trackId: string) {
    try {
      await this.prisma.track.update({
        where: { id: trackId },
        data: { favorite: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async addFavAlbum(albumId: string): Promise<IAlbumData | IAlbumData[]> {
    try {
      const album = await this.prisma.album.findUnique({
        where: { id: albumId },
      });
      if (!album) {
        throw new UnprocessableEntityException(
          `Album with id ${albumId} not found`,
        );
      }

      const response = await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: true },
      });

      return prepareAlbumResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteFavAlbum(albumId: string) {
    try {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { favorite: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async addFavArtist(artistId: string): Promise<IArtistData | IArtistData[]> {
    try {
      const artist = await this.prisma.artist.findUnique({
        where: { id: artistId },
      });
      if (!artist) {
        throw new UnprocessableEntityException(
          `Artist with id ${artistId} not found`,
        );
      }

      const response = await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: true },
      });

      return prepareArtistResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteFavArtist(artistId: string) {
    try {
      await this.prisma.artist.update({
        where: { id: artistId },
        data: { favorite: false },
      });
    } catch (error) {
      throw error;
    }
  }
}
