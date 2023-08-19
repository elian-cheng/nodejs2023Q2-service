import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { RefreshDTO } from './dto/refresh.dto';
import { Public } from 'src/utils/validation';
import { RtGuard } from 'src/utils/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body(ValidationPipe) dto: AuthDTO) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body(ValidationPipe) dto: AuthDTO) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Body(
      new ValidationPipe({
        exceptionFactory: () => new UnauthorizedException(),
      }),
    )
    dto: RefreshDTO,
  ) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}
