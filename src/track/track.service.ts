import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITrackData, prepareTrackResponse } from './models/track.model';
import { TrackDTO } from './dto/track.dto';
import { PRISMA_ERROR } from 'src/utils/constants';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getTracks(): Promise<ITrackData | ITrackData[]> {
    const tracks = await this.prisma.track.findMany();

    return prepareTrackResponse(tracks);
  }

  async getTrack(trackId: string): Promise<ITrackData | ITrackData[]> {
    const response = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!response) throw new NotFoundException();

    return prepareTrackResponse(response);
  }

  async createTrack(dto: TrackDTO): Promise<ITrackData | ITrackData[]> {
    const track = await this.prisma.track.create({
      data: {
        name: dto.name,
        artistId: dto.artistId,
        albumId: dto.albumId,
        duration: dto.duration,
        favorite: false,
      },
    });

    return prepareTrackResponse(track);
  }

  async updateTrackInfo(
    trackId: string,
    dto: TrackDTO,
  ): Promise<ITrackData | ITrackData[]> {
    const response = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!response) throw new NotFoundException();

    const updatedTrack = await this.prisma.track.update({
      where: { id: trackId },
      data: {
        name: dto.name,
        artistId: dto.artistId,
        albumId: dto.albumId,
        duration: dto.duration,
      },
    });

    return prepareTrackResponse(updatedTrack);
  }

  async deleteTrack(trackId: string) {
    try {
      await this.prisma.track.delete({ where: { id: trackId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }
}
