import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';

@Injectable()
export class MusicSongService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { OR: [{ status: Status.APPROVED }, { status: Status.DELETED }] },
    });
  }

  public async findOne(songId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
    });
  }

  public async addListens(songId: number): Promise<void> {
    await this.prisma.song.update({
      data: {
        listens: {
          increment: 1,
        },
      },
      where: { id: songId },
    });
  }
}
