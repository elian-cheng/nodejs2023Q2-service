import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:uuid')
  addArtistToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addArtistToFavs(uuid);
  }

  @Post('album/:uuid')
  addAlbumsToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addAlbumsToFavs(uuid);
  }

  @Post('track/:uuid')
  addTracksToFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.addTracksToFavs(uuid);
  }

  @Delete('track/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.removeTrackFromFavs(uuid);
  }

  @Delete('artist/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.removeArtistFromFavs(uuid);
  }

  @Delete('album/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavs(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favsService.removeAlbumFromFavs(uuid);
  }
}
