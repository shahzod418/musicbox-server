import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Prisma, Song } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: Pick<Prisma.SongCreateInput, 'name' | 'text'> & {
      artistId: number;
      albumId?: number;
    },
    files: { audio: Express.Multer.File; cover?: Express.Multer.File },
  ): Promise<Song> {
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
            id: artistId,
          },
        },
      },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);
    }
    await this.file.addFile(artistId, RoleType.Artist, FileType.Audio, audio);

    return song;
  }

  public async findAll(artistId: number): Promise<Song[]> {
    return await this.prisma.song.findMany({ where: { artistId } });
  }

  public async findOne(songId: number, artistId: number): Promise<Song> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, artistId },
    });
  }

  public async update(
    songId: number,
    artistId: number,
    data: Pick<Prisma.SongUpdateInput, 'name' | 'text'> & { albumId?: number },
    files: { audio?: Express.Multer.File; cover?: Express.Multer.File },
  ): Promise<Song> {
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
    });

    if (cover) {
      await this.file.addFile(
        song.artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );

      if (previousCover) {
        await this.file.removeFile(
          song.artistId,
          RoleType.Artist,
          FileType.Cover,
          previousCover,
        );
      }
    }

    if (audio) {
      await this.file.addFile(
        song.artistId,
        RoleType.Artist,
        FileType.Audio,
        audio,
      );
      await this.file.removeFile(
        song.artistId,
        RoleType.Artist,
        FileType.Audio,
        previousAudio,
      );
    }

    return song;
  }

  public async remove(id: number): Promise<Success> {
    try {
      await this.prisma.song.update({
        data: {
          status: {
            set: Status.DELETED,
          },
        },
        where: {
          id,
        },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
