import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { BaseArtistService } from '@base/artist.service';

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
export class ArtistSongService extends BaseArtistService {
  private readonly songSelect = {
    id: true,
    name: true,
    text: true,
    listens: true,
    explicit: true,
    status: true,
    cover: true,
  };

  public async create(
    data: ICreateSong,
    files: ICreateSongFiles,
  ): Promise<ISong> {
    const { artistId, albumId, ...payload } = data;
    const { audio, cover } = files;

    const song = await this.prisma.song.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.name }),
        ...(albumId && { album: { connect: { id: albumId } } }),
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

  public async findAll(artistId: number): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { artistId },
      select: this.songSelect,
    });
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
        status: { set: Status.Review },
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
    await this.prisma.song.update({
      data: { status: { set: Status.Deleted } },
      where: { id: songId },
    });

    return { success: true };
  }
}
