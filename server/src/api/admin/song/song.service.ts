import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

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
    artist: {
      select: {
        id: true,
        name: true,
      },
    },
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
      select: { ...this.songSelect },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);
    }

    await this.file.addFile(artistId, RoleType.Artist, FileType.Audio, audio);

    return song;
  }

  public async findOne(songId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId },
      select: { ...this.songSelect },
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
      select: { ...this.songSelect },
    });

    if (cover) {
      await this.file.updateFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
        previousCover,
      );
    }

    if (audio) {
      await this.file.updateFile(
        artistId,
        RoleType.Artist,
        FileType.Audio,
        audio,
        previousAudio,
      );
    }

    return song;
  }

  public async remove(songId: number): Promise<ISuccess> {
    const { artistId, audio, cover } = await this.prisma.song.delete({
      where: { id: songId },
      select: { artistId: true, audio: true, cover: true },
    });

    if (cover) {
      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
    }

    await this.file.removeFile(
      artistId,
      RoleType.Artist,
      FileType.Audio,
      audio,
    );

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

      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
    }

    return { success: true };
  }
}
