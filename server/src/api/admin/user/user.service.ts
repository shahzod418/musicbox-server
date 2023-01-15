import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { RoleType } from '@interfaces/file';

import type { IUser } from './user.interface';
import type { ISuccess } from '@interfaces/response';
import type { Role } from '@prisma/client';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });
  }

  public async updateRole(userId: number, role: Role): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        role,
      },
      where: { id: userId },
    });

    return { success: true };
  }

  public async remove(userId: number): Promise<ISuccess> {
    const { artist } = await this.prisma.user.delete({
      where: { id: userId },
      include: {
        artist: true,
      },
    });

    if (artist) {
      await this.file.removeResources(artist.id, RoleType.Artist);
    }
    await this.file.removeResources(userId, RoleType.User);

    return { success: true };
  }
}
