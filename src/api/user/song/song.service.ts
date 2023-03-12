import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserSongService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<ISong[]> {
    const { songs } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        songs: {
          where: {
            song: {
              OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
            },
          },
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
                artist: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
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
