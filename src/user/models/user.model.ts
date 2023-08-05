import { User } from '@prisma/client';
export interface IUserData {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
class UserData implements IUserData {
  public id: string;
  public login: string;
  public version: number;
  public createdAt: number;
  public updatedAt: number;

  constructor(data: User) {
    this.id = data.id;
    this.login = data.login;
    this.version = data.version;
    this.createdAt = data.createdAt.valueOf();
    this.updatedAt = data.updatedAt.valueOf();
  }
}

export const prepareUserResponse = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((item) => new UserData(item));
  } else {
    return new UserData(data);
  }
};
