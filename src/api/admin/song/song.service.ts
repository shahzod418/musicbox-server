import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

import type {
  ICreateSong,
  ICreateSongFiles,
  ISong,
  IUpdateSong,
  IUpdateSongFiles,
} from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminSongService {
  private readonly songSelect = {
    id: true,
    name: true,
    text: true,
    listens: true,
    explicit: true,
    cover: true,
    status: true,
    artist: { select: { id: true, name: true } },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: ICreateSong,
    files: ICreateSongFiles,
  ): Promise<ISong> {
    const { artistId, albumId, ...payload } = data;
    const { audio, cover } = files;

    const song = await this.prisma.song.create({
      data: {
        ...(cover && { cover: cover.name }),
        ...(albumId && { album: { connect: { id: albumId } } }),
        ...payload,
        artist: { connect: { id: artistId } },
        audio: audio.name,
      },
      select: this.songSelect,
    });

    if (cover) {
      const addCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        file: cover,
      };

      await this.file.addFile(addCoverArgs);
    }

    const addAudioArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Audio,
      file: audio,
    };

    await this.file.addFile(addAudioArgs);

    return song;
  }

  public async findOne(songId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId },
      select: this.songSelect,
    });
  }

  public async update(
    songId: number,
    data: IUpdateSong,
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    const { albumId, ...payload } = data;
    const { audio, cover } = files;

    const {
      artistId,
      audio: previousAudio,
      cover: previousCover,
    } = await this.prisma.song.findFirstOrThrow({
      where: { id: songId },
      select: { artistId: true, audio: true, cover: true },
    });

    const song = await this.prisma.song.update({
      data: {
        ...payload,
        ...(albumId && { album: { connect: { id: albumId } } }),
        ...(audio && { audio: { set: audio.name } }),
        ...(cover && { cover: { set: cover.name } }),
      },
      where: { id: songId },
      select: this.songSelect,
    });

    if (cover) {
      const updateCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        currentFile: cover,
        previousFilename: previousCover,
      };

      await this.file.updateFile(updateCoverArgs);
    }

    if (audio) {
      const updateAudioArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Audio,
        currentFile: audio,
        previousFilename: previousAudio,
      };

      await this.file.updateFile(updateAudioArgs);
    }

    return song;
  }

  public async remove(songId: number): Promise<ISuccess> {
    const { artistId, audio, cover } = await this.prisma.song.delete({
      where: { id: songId },
      select: { artistId: true, audio: true, cover: true },
    });

    if (cover) {
      const removeCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        filename: cover,
      };

      await this.file.removeFile(removeCoverArgs);
    }

    const removeAudioArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Audio,
      filename: audio,
    };

    await this.file.removeFile(removeAudioArgs);

    return { success: true };
  }

  public async removeCover(songId: number): Promise<ISuccess> {
    const { artistId, cover } = await this.prisma.song.findFirstOrThrow({
      where: { id: songId },
      select: { artistId: true, cover: true },
    });

    if (cover) {
      await this.prisma.song.update({
        where: { id: songId },
        data: { cover: { set: null } },
      });

      const removeCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        filename: cover,
      };

      await this.file.removeFile(removeCoverArgs);
    }

    return { success: true };
  }
}
