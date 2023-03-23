import { Injectable } from '@nestjs/common';

import { BaseUserService } from '@base/user.service';
import { getPrismaWhere } from '@constants/prisma-where';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';
import type { Role } from '@prisma/client';

@Injectable()
export class UserSongService extends BaseUserService {
  private readonly songSelect = {
    select: {
      song: {
        select: {
          id: true,
          name: true,
          text: true,
          listens: true,
          explicit: true,
          cover: true,
          status: true,
          albumId: true,
          artist: { select: { id: true, name: true } },
        },
      },
    },
  };

  public async findAll(userId: number, role: Role): Promise<ISong[]> {
    const { songs } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        songs: {
          ...this.songSelect,
          where: { song: getPrismaWhere(userId, role) },
        },
      },
    });

    return songs.map(({ song }) => song);
  }

  public async addSong(userId: number, songId: number): Promise<ISuccess> {
    await this.prisma.userSong.create({
      data: {
        user: { connect: { id: userId } },
        song: { connect: { id: songId } },
      },
    });

    return { success: true };
  }

  public async removeSong(userId: number, songId: number): Promise<ISuccess> {
    await this.prisma.userSong.delete({
      where: { userId_songId: { userId, songId } },
    });

    return { success: true };
  }
}
