import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { IUserData, prepareUserResponse } from './models/user.model';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdatePasswordDTO } from './dto/updateUser.dto';
import { PRISMA_ERROR } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<IUserData | IUserData[]> {
    const users = await this.prisma.user.findMany();

    return prepareUserResponse(users);
  }

  async getUser(userId: string): Promise<IUserData | IUserData[]> {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();

    return prepareUserResponse(response);
  }

  async createUser(dto: CreateUserDTO): Promise<IUserData | IUserData[]> {
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
      },
    });

    return prepareUserResponse(user);
  }

  async updateUserPassword(
    userId: string,
    dto: UpdatePasswordDTO,
  ): Promise<IUserData | IUserData[]> {
    const response = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!response) throw new NotFoundException();
    if (response.password !== dto.oldPassword) throw new ForbiddenException();

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: dto.newPassword, version: (response.version += 1) },
    });

    return prepareUserResponse(updatedUser);
  }

  async deleteUser(userId: string) {
    try {
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR) {
          throw new NotFoundException();
        }
      }
    }
  }
}
