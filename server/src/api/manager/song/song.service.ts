import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(artistId: number): Promise<Song[]> {
    return await this.prisma.song.findMany({
      where: {
        artistId,
        status: Status.REVIEW,
      },
    });
  }

  public async findOne(songId: number): Promise<Song> {
    return await this.prisma.song.findFirstOrThrow({
      where: { id: songId, status: Status.REVIEW },
    });
  }

  public async getAudio(songId: number): Promise<Buffer> {
    const { artistId, audio } = await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        status: Status.REVIEW,
      },
      select: {
        artistId: true,
        audio: true,
      },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Audio,
      audio,
    );
  }

  public async getCover(songId: number): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        status: Status.REVIEW,
      },
      select: { artistId: true, cover: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async approve(songId: number): Promise<Success> {
    try {
      await this.prisma.song.update({
        data: {
          status: {
            set: Status.APPROVED,
          },
        },
        where: { id: songId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async decline(songId: number): Promise<Success> {
    try {
      await this.prisma.song.update({
        data: {
          status: {
            set: Status.DECLINED,
          },
        },
        where: { id: songId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async updateExplicit(
    songId: number,
    explicit: boolean,
  ): Promise<Success> {
    try {
      await this.prisma.song.update({
        data: { explicit },
        where: { id: songId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
