import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  public async remove(albumId: number): Promise<Success> {
    try {
      const { artistId, cover } = await this.prisma.album.delete({
        where: { id: albumId },
        select: { artistId: true, cover: true },
      });

      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
