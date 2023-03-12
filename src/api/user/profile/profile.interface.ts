import type { Prisma, User } from '@prisma/client';

export type IUser = Omit<User, 'hash' | 'role'>;

export type IUpdateUser = Pick<Prisma.UserUpdateInput, 'name'>;
