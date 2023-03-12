import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { Prisma, Role, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: Pick<Prisma.UserCreateInput, 'email' | 'hash' | 'name'>,
  ): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  public async findOne(email: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({ where: { email } });
  }

  public async getUserRole(userId: number): Promise<Role> {
    const { role } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { role: true },
    });

    return role;
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
