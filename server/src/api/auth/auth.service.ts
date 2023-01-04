import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { PrismaService } from '@database/prisma.service';
import { UserService } from '@services/user/user.service';

import type { Prisma, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  public async signUp(
    data: Pick<Prisma.UserCreateInput, 'email' | 'name'> & { password: string },
  ): Promise<User | Error> {
    const isUniqueUser = await this.user.isUnique(data.email);
    if (!isUniqueUser) {
      return new Error('User already exists');
    }

    const { password, ...payload } = data;

    const hashPassword = await hash(password, 10);

    return await this.user.create({ ...payload, hash: hashPassword });
  }

  public async signIn(
    data: Pick<User, 'email'> & { password: string },
  ): Promise<User | Error> {
    const { email, password } = data;

    try {
      const user = await this.user.findOne(email);

      const isValidPassword = await compare(password, user.hash);

      if (!isValidPassword) {
        return new Error('Incorrect password');
      }

      return user;
    } catch {}
    return new Error('User not found');
  }
}
