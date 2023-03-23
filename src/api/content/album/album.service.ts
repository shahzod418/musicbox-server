import { Injectable } from '@nestjs/common';

import { getPrismaWhere } from '@constants/prisma-where';
import { PrismaService } from '@database/prisma.service';

import type { IAlbum, ISong } from './album.interface';
import type { Role } from '@prisma/client';

@Injectable()
export class ContentAlbumService {
  private readonly albumSelect = {
    id: true,
    name: true,
    cover: true,
    status: true,
    artist: { select: { id: true, name: true } },
  };

  private readonly songSelect = {
    id: true,
    name: true,
    text: true,
    listens: true,
    explicit: true,
    cover: true,
    audio: true,
    status: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId?: number, role?: Role): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: getPrismaWhere(userId, role),
      select: this.albumSelect,
    });
  }

  public async findOne(
    albumId: number,
    userId?: number,
    role?: Role,
  ): Promise<IAlbum & { songs: ISong[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getPrismaWhere(userId, role) },
      select: {
        ...this.albumSelect,
        songs: {
          where: getPrismaWhere(userId, role),
          select: this.songSelect,
        },
      },
    });
  }
}
