import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';

@Injectable()
export class ContentSongService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { OR: [{ status: Status.APPROVED }, { status: Status.DELETED }] },
      select: {
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
      },
    });
  }

  public async findOne(songId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
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
      },
    });
  }

  public async addListens(songId: number): Promise<void> {
    await this.prisma.song.update({
      data: { listens: { increment: 1 } },
      where: { id: songId },
    });
  }
}
