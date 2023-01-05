import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Song } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Song[]> {
    return await this.prisma.song.findMany({
      where: { OR: [{ status: Status.APPROVED }, { status: Status.DELETED }] },
    });
  }

  public async findOne(songId: number): Promise<Song> {
    return await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
    });
  }

  public async getAudio(songId: number): Promise<Buffer> {
    const { artistId, audio } = await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
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
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
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

  public async addListens(songId: number): Promise<void> {
    await this.prisma.song.update({
      data: {
        listens: {
          increment: 1,
        },
      },
      where: { id: songId },
    });
  }
}
