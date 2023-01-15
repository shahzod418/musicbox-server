import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ManagerSongService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(artistId: number): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: {
        artistId,
        status: Status.REVIEW,
      },
      select: {
        id: true,
        name: true,
        text: true,
        explicit: true,
        status: true,
        artistId: true,
        albumId: true,
        cover: true,
        audio: true,
      },
    });
  }

  public async findOne(songId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, status: Status.REVIEW },
      select: {
        id: true,
        name: true,
        text: true,
        explicit: true,
        status: true,
        artistId: true,
        albumId: true,
        cover: true,
        audio: true,
      },
    });
  }

  public async approve(songId: number): Promise<ISuccess> {
    await this.prisma.song.update({
      data: {
        status: {
          set: Status.APPROVED,
        },
      },
      where: { id: songId },
    });

    return { success: true };
  }

  public async decline(songId: number): Promise<ISuccess> {
    await this.prisma.song.update({
      data: {
        status: {
          set: Status.DECLINED,
        },
      },
      where: { id: songId },
    });

    return { success: true };
  }

  public async updateExplicit(
    songId: number,
    explicit: boolean,
  ): Promise<ISuccess> {
    await this.prisma.song.update({
      data: { explicit },
      where: { id: songId },
    });

    return { success: true };
  }
}
