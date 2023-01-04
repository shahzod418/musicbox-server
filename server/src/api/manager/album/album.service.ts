import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

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

  public async findAll(artistId: number): Promise<Album[]> {
    return await this.prisma.album.findMany({
      where: {
        artistId,
        status: Status.REVIEW,
      },
    });
  }

  public async findOne(id: number): Promise<Album> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id, status: Status.REVIEW },
    });
  }

  public async getCover(id: number): Promise<Buffer> {
    const { cover } = await this.prisma.album.findFirstOrThrow({
      where: {
        id,
        status: Status.REVIEW,
      },
      select: { cover: true },
    });

    return await this.file.getFile(id, RoleType.Artist, FileType.Cover, cover);
  }

  public async approve(id: number): Promise<Success> {
    try {
      await this.prisma.album.update({
        data: {
          status: {
            set: Status.APPROVED,
          },
        },
        where: { id },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async decline(id: number): Promise<Success> {
    try {
      await this.prisma.album.update({
        data: {
          status: {
            set: Status.DECLINED,
          },
          songs: {
            updateMany: {
              data: {
                status: {
                  set: Status.DECLINED,
                },
              },
              where: {
                artistId: id,
              },
            },
          },
        },
        where: { id },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
