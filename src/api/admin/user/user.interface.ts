import type { IFile } from '@interfaces/file';
import type { Prisma, User } from '@prisma/client';

export type IUser = Omit<User, 'hash'>;

export type ICreateUser = Pick<
  Prisma.UserCreateInput,
  'email' | 'name' | 'role'
> & {
  password: string;
};

export type IUpdateUser = Pick<
  Prisma.UserUpdateInput,
  'email' | 'name' | 'role'
> & {
  password?: string;
};

export type IUserFiles = {
  avatar?: IFile;
};
