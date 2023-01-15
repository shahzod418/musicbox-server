import type { User } from '@prisma/client';

export type IUser = Omit<User, 'hash'>;
