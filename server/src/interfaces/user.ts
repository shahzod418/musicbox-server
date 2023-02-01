import type { User } from '@prisma/client';

export type IUserRequest = { user: Pick<User, 'id' | 'email' | 'role'> };
