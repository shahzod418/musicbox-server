import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserSongService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<ISong[]> {
    const { songs } = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        songs: {
          select: {
            song: true,
          },
        },
      },
    });

    return songs.map(({ song }) => song);
  }

  public async addSong(userId: number, songId: number): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        songs: {
          connect: {
            userId_songId: {
              userId,
              songId,
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });

    return { success: true };
  }

  public async removeSong(userId: number, songId: number): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        songs: {
          disconnect: {
            userId_songId: {
              userId,
              songId,
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });

    return { success: true };
  }
}
