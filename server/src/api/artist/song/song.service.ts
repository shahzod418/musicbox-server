import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

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
export class ArtistSongService {
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
        ...payload,
        ...(cover && { cover: cover.originalname }),
        ...(albumId && {
          album: {
            connect: { id: albumId },
          },
        }),
        audio: audio.originalname,
        artist: {
          connect: {
            id: Number(artistId),
          },
        },
      },
      select: {
        id: true,
        name: true,
        text: true,
        listens: true,
        explicit: true,
        status: true,
        audio: true,
        cover: true,
      },
    });

    if (cover) {
      await this.file.addFile(
        Number(artistId),
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
    }
    await this.file.addFile(
      Number(artistId),
      RoleType.Artist,
      FileType.Audio,
      audio,
    );

    return song;
  }

  public async findAll(artistId: number): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { artistId },
      select: {
        id: true,
        name: true,
        text: true,
        listens: true,
        explicit: true,
        status: true,
        audio: true,
        cover: true,
      },
    });
  }

  public async findOne(songId: number, artistId: number): Promise<ISong> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, artistId },
      select: {
        id: true,
        name: true,
        text: true,
        listens: true,
        explicit: true,
        status: true,
        audio: true,
        cover: true,
      },
    });
  }

  public async update(
    songId: number,
    artistId: number,
    data: IUpdateSong,
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    const { albumId, ...payload } = data;
    const { audio, cover } = files;

    const { audio: previousAudio, cover: previousCover } =
      await this.prisma.song.findFirstOrThrow({
        where: { id: songId, artistId },
        select: {
          audio: true,
          cover: true,
        },
      });

    const song = await this.prisma.song.update({
      data: {
        ...payload,
        ...(albumId && {
          album: {
            connect: {
              id: albumId,
            },
          },
        }),
        ...(audio && {
          audio: {
            set: audio.originalname,
          },
        }),
        ...(cover && {
          cover: {
            set: cover.originalname,
          },
        }),
        status: {
          set: Status.REVIEW,
        },
      },
      where: { id: songId },
      select: {
        id: true,
        name: true,
        text: true,
        listens: true,
        explicit: true,
        status: true,
        audio: true,
        cover: true,
      },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);

      if (previousCover) {
        await this.file.removeFile(
          artistId,
          RoleType.Artist,
          FileType.Cover,
          previousCover,
        );
      }
    }

    if (audio) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Audio, audio);
      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Audio,
        previousAudio,
      );
    }

    return song;
  }

  public async remove(songId: number): Promise<ISuccess> {
    await this.prisma.song.update({
      data: {
        status: {
          set: Status.DELETED,
        },
      },
      where: {
        id: songId,
      },
    });

    return { success: true };
  }
}
