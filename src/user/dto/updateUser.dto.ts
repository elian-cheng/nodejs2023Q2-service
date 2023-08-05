import { IsNotEmpty, IsString } from 'class-validator';

interface IUpdatePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export class UpdatePasswordDTO implements IUpdatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
