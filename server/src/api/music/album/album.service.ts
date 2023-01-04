import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Album, Song } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany({
      where: {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
    });
  }

  public async findOne(id: number): Promise<Album & { songs: Song[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: {
        id,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      include: {
        songs: true,
      },
    });
  }

  public async getCover(id: number): Promise<Buffer> {
    const { cover } = await this.prisma.album.findFirstOrThrow({
      where: {
        id,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: { cover: true },
    });

    return await this.file.getFile(id, RoleType.Artist, FileType.Cover, cover);
  }
}
