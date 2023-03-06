import { Injectable } from '@nestjs/common';

import { getContentWhere } from '@constants/content-where';
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

  public async findAll(role?: Role, userId?: number): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: getContentWhere(role, userId),
      select: { ...this.songSelect },
    });
  }

  public async findOne(
    songId: number,
    role?: Role,
    userId?: number,
  ): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, ...getContentWhere(role, userId) },
      select: { ...this.songSelect },
    });
  }

  public async addListens(songId: number): Promise<void> {
    await this.prisma.song.update({
      data: { listens: { increment: 1 } },
      where: { id: songId },
    });
  }
}
