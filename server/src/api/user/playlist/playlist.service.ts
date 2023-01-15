import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type {
  ICreatePlaylist,
  IPlaylist,
  IUpdatePlaylist,
} from './playlist.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserPlaylistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: ICreatePlaylist,
    cover?: Express.Multer.File,
  ): Promise<IPlaylist> {
    const { userId, ...payload } = data;

    const playlist = await this.prisma.playlist.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.originalname }),
        user: { connect: { id: userId } },
      },
      select: {
        id: true,
        name: true,
        cover: true,
      },
    });

    if (cover) {
      await this.file.addFile(userId, RoleType.User, FileType.Cover, cover);
    }

    return playlist;
  }

  public async findAll(userId: number): Promise<IPlaylist[]> {
    return await this.prisma.playlist.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        cover: true,
      },
    });
  }

  public async findOne(playlistId: number, userId: number): Promise<IPlaylist> {
    return await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: {
        id: true,
        name: true,
        cover: true,
        songs: {
          select: {
            song: {
              select: {
                id: true,
                name: true,
                explicit: true,
                cover: true,
                audio: true,
                artistId: true,
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
  }

  public async update(
    playlistId: number,
    payload: IUpdatePlaylist,
    cover?: Express.Multer.File,
  ): Promise<IPlaylist> {
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

  public async delete(playlistId: number): Promise<ISuccess> {
    const { userId, cover } = await this.prisma.playlist.delete({
      where: { id: playlistId },
      select: { userId: true, cover: true },
    });

    if (cover) {
      await this.file.removeFile(userId, RoleType.User, FileType.Cover, cover);
    }

    return { success: false };
  }

  public async addSong(
    playlistId: number,
    userId: number,
    songId: number,
  ): Promise<IPlaylist> {
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
  ): Promise<IPlaylist> {
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
