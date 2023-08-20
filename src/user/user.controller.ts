import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdatePasswordDTO } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body(ValidationPipe) dto: CreateUserDTO) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  updateUserPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdatePasswordDTO,
  ) {
    return this.userService.updateUserPassword(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
