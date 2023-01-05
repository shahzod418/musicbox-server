import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Playlist, Prisma } from '@prisma/client';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: Pick<Prisma.PlaylistCreateInput, 'name'> & { userId: number },
    cover?: Express.Multer.File,
  ): Promise<Playlist> {
    const { userId, ...payload } = data;

    const playlist = await this.prisma.playlist.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.originalname }),
        user: { connect: { id: userId } },
      },
    });

    if (cover) {
      await this.file.addFile(userId, RoleType.User, FileType.Cover, cover);
    }

    return playlist;
  }

  public async findAll(userId: number): Promise<Playlist[]> {
    return await this.prisma.playlist.findMany({ where: { userId } });
  }

  public async findOne(playlistId: number, userId: number): Promise<Playlist> {
    return await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
    });
  }

  public async update(
    playlistId: number,
    payload: Pick<Prisma.PlaylistUpdateInput, 'name'>,
    cover?: Express.Multer.File,
  ): Promise<Playlist> {
    const playlist = await this.prisma.playlist.update({
      data: {
        ...payload,
        ...(cover && { cover: { set: cover.originalname } }),
      },
      where: { id: playlistId },
    });

    if (cover) {
      await this.file.addFile(
        playlist.userId,
        RoleType.User,
        FileType.Cover,
        cover,
      );
    }

    return playlist;
  }

  public async delete(playlistId: number): Promise<Success> {
    try {
      const { userId, cover } = await this.prisma.playlist.delete({
        where: { id: playlistId },
        select: { userId: true, cover: true },
      });

      if (cover) {
        await this.file.removeFile(
          userId,
          RoleType.User,
          FileType.Cover,
          cover,
        );
      }

      return { success: false };
    } catch {
      return { success: false };
    }
  }

  public async addSong(
    playlistId: number,
    userId: number,
    songId: number,
  ): Promise<Playlist> {
    return await this.prisma.playlist.update({
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
        id: playlistId,
      },
    });
  }

  public async deleteSong(
    playlistId: number,
    userId: number,
    songId: number,
  ): Promise<Playlist> {
    return await this.prisma.playlist.update({
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
        id: playlistId,
      },
    });
  }
}
