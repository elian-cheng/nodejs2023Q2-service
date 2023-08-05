import { IsNotEmpty, IsString } from 'class-validator';

interface ICreateUserDTO {
  login: string;
  password: string;
}

export class CreateUserDTO implements ICreateUserDTO {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
