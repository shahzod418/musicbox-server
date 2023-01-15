import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminAlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<IAlbum[]> {
    return await this.prisma.album.findMany();
  }

  public async remove(albumId: number): Promise<ISuccess> {
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
  }
}
