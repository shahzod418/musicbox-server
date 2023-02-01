import type { Prisma, User } from '@prisma/client';

export type IAccessToken = { access_token: string };

export type IUser = Pick<User, 'id' | 'email'>;

export type ISignData = Pick<Prisma.UserCreateInput, 'email'> & {
  password: string;
};
