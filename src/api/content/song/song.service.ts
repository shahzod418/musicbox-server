import { Injectable } from '@nestjs/common';

import { getPrismaWhere } from '@constants/prisma-where';
import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';
import type { Role } from '@prisma/client';

@Injectable()
export class ContentSongService {
  private readonly songSelect = {
    id: true,
    name: true,
    text: true,
    listens: true,
    explicit: true,
    cover: true,
    status: true,
    albumId: true,
    artist: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId?: number, role?: Role): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: getPrismaWhere(userId, role),
      select: this.songSelect,
    });
  }

  public async findOne(
    songId: number,
    userId?: number,
    role?: Role,
  ): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, ...getPrismaWhere(userId, role) },
      select: this.songSelect,
    });
  }
}
