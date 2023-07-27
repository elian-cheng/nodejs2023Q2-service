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
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('artist/:uuid')
  addArtistToFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.addArtistToFavorites(uuid);
  }

  @Post('album/:uuid')
  addAlbumsToFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.addAlbumsToFavorites(uuid);
  }

  @Post('track/:uuid')
  addTracksToFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.addTracksToFavorites(uuid);
  }

  @Delete('track/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.removeTrackFromFavorites(uuid);
  }

  @Delete('artist/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.removeArtistFromFavorites(uuid);
  }

  @Delete('album/:uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.favoritesService.removeAlbumFromFavorites(uuid);
  }
}
