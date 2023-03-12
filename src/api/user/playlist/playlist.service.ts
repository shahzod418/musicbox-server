import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

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
  private readonly playlistSelect = {
    id: true,
    name: true,
    cover: true,
  };

  private readonly songsSelect = {
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
              artist: { select: { id: true, name: true } },
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
      select: this.playlistSelect,
    });

    if (cover) {
      const addCoverArgs = {
        id: userId,
        role: Role.User,
        type: FileType.Cover,
        file: cover,
      };

      await this.file.addFile(addCoverArgs);
    }

    return playlist;
  }

  public async findAll(userId: number): Promise<IPlaylist[]> {
    return await this.prisma.playlist.findMany({
      where: { userId },
      select: this.playlistSelect,
    });
  }

  public async findOne(
    playlistId: number,
    userId: number,
  ): Promise<IPlaylist & { songs: ISong[] }> {
    const { songs, ...playlist } = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: {
        ...this.playlistSelect,
        songs: {
          ...this.songsSelect,
          where: getContentWhere(Role.User),
        },
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
        ...this.playlistSelect,
        songs: {
          ...this.songsSelect,
          where: getContentWhere(Role.User),
        },
        userId: true,
      },
    });

    if (cover) {
      const updateCoverArgs = {
        id: userId,
        role: Role.User,
        type: FileType.Cover,
        currentFile: cover,
        previousFilename: previousCover,
      };

      await this.file.updateFile(updateCoverArgs);
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
      const removeCoverArgs = {
        id: userId,
        role: Role.User,
        type: FileType.Cover,
        filename: cover,
      };

      await this.file.removeFile(removeCoverArgs);
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
