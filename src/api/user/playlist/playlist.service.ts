import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type {
  ICreatePlaylist,
  IPlaylist,
  ISong,
  IUpdatePlaylist,
} from './playlist.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserPlaylistService {
  private readonly songsSelect = {
    songs: {
      select: {
        song: {
          select: {
            song: {
              select: {
                id: true,
                name: true,
                text: true,
                listens: true,
                explicit: true,
                cover: true,
                audio: true,
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
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: ICreatePlaylist,
    cover?: IFile,
  ): Promise<IPlaylist> {
    const { userId, ...payload } = data;

    const playlist = await this.prisma.playlist.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.name }),
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

  public async findOne(
    playlistId: number,
    userId: number,
  ): Promise<IPlaylist & { songs: ISong[] }> {
    const { songs, ...playlist } = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: {
        id: true,
        name: true,
        cover: true,
        ...this.songsSelect,
      },
    });

    return {
      ...playlist,
      songs: songs.map(({ song: { song } }) => song),
    };
  }

  public async update(
    playlistId: number,
    payload: IUpdatePlaylist,
    cover?: IFile,
  ): Promise<IPlaylist & { songs: ISong[] }> {
    const { cover: previousCover } =
      await this.prisma.playlist.findFirstOrThrow({
        where: { id: playlistId },
        select: { cover: true },
      });

    const { userId, songs, ...playlist } = await this.prisma.playlist.update({
      data: {
        ...payload,
        ...(cover && { cover: { set: cover.name } }),
      },
      where: { id: playlistId },
      select: {
        id: true,
        name: true,
        cover: true,
        userId: true,
        ...this.songsSelect,
      },
    });

    if (cover) {
      await this.file.updateFile(
        userId,
        RoleType.User,
        FileType.Cover,
        cover,
        previousCover,
      );
    }

    return {
      ...playlist,
      songs: songs.map(({ song: { song } }) => song),
    };
  }

  public async delete(playlistId: number): Promise<ISuccess> {
    const { userId, cover } = await this.prisma.playlist.delete({
      where: { id: playlistId },
      select: { userId: true, cover: true },
    });

    if (cover) {
      await this.file.removeFile(userId, RoleType.User, FileType.Cover, cover);
    }

    return { success: true };
  }

  public async addSong(
    playlistId: number,
    userId: number,
    songId: number,
  ): Promise<ISuccess> {
    await this.prisma.playlistSong.create({
      data: {
        song: { connect: { userId_songId: { userId, songId } } },
        playlist: { connect: { id: playlistId } },
      },
    });

    return { success: true };
  }

  public async deleteSong(
    playlistId: number,
    userId: number,
    songId: number,
  ): Promise<ISuccess> {
    await this.prisma.playlistSong.delete({
      where: { userId_songId_playlistId: { userId, songId, playlistId } },
    });

    return { success: true };
  }
}
