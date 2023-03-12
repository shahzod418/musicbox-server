import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserSongService {
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

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<ISong[]> {
    const { songs } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        songs: {
          ...this.songSelect,
          where: { song: getContentWhere(Role.User) },
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
