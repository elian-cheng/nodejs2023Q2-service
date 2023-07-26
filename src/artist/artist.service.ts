import { Injectable } from '@nestjs/common';
import { checkItemExistence } from 'src/utils/helpers';
import { CreateArtistDto } from './dto/createArtist.dto';
import { UpdateArtistDto } from './dto/updateArtist.dto';
import Artist from './models/artist.model';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    checkItemExistence(this.artists, id);
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist(createArtistDto);
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    checkItemExistence(this.artists, id);
    const existingArtist = this.artists.find((artist) => artist.id === id);
    for (const key in existingArtist) {
      if (updateArtistDto.grammy === false) {
        existingArtist.grammy = updateArtistDto.grammy;
      } else if (updateArtistDto[key]) {
        existingArtist[key] = updateArtistDto[key];
      }
    }
    return existingArtist;
  }

  remove(id: string) {
    const existingArtistId = this.artists.findIndex(
      (artist) => artist.id === id,
    );
    checkItemExistence(this.artists, id);
    this.artists.splice(existingArtistId, 1);
  }
}
