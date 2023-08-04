import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelNames } from 'src/utils/constants';
import { checkItemExistence } from 'src/utils/validation';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updateUser.dto';
import User from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(userId: string) {
    await checkItemExistence(this.userRepository, userId, ModelNames.USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(createdUser);
    return newUser;
  }

  async update(userId: string, UpdatePasswordDto: UpdatePasswordDto) {
    await checkItemExistence(this.userRepository, userId, ModelNames.USER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    this.isOldPasswordValid(user, UpdatePasswordDto.oldPassword);
    user.password = UpdatePasswordDto.newPassword;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async remove(userId: string) {
    await checkItemExistence(this.userRepository, userId, ModelNames.USER);
    await this.userRepository.delete(userId);
  }

  isOldPasswordValid(user: User, oldPassword: string) {
    if (user.password !== oldPassword) {
      throw new ForbiddenException(`Wrong old password`);
    }
  }
}
