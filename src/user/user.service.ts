import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IUserData, prepareUserResponse } from './models/user.model';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdatePasswordDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

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
    const salt = Number(this.config.get('CRYPT_SALT'));
    const hash = await bcrypt.hash(dto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hash,
        hashedRt: '',
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

    const isPasswordMatches = await bcrypt.compare(
      dto.oldPassword,
      response.password,
    );

    if (!isPasswordMatches) throw new ForbiddenException();

    const salt = Number(this.config.get('CRYPT_SALT'));
    const hash = await bcrypt.hash(dto.newPassword, salt);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash, version: (response.version += 1) },
    });

    return prepareUserResponse(updatedUser);
  }

  async deleteUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      throw error;
    }
  }
}
