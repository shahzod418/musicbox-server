import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public create(
    data: Pick<Prisma.UserCreateInput, 'email' | 'hash' | 'name'>,
  ): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public findOne(email: string): Promise<User> {
    return this.prisma.user.findFirstOrThrow({ where: { email } });
  }

  public async isUnique(email: string): Promise<boolean> {
    try {
      await this.prisma.user.findFirstOrThrow({ where: { email } });

      return false;
    } catch {
      return true;
    }
  }
}
