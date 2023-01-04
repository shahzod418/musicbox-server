import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany({
      where: { status: Status.REVIEW },
    });
  }

  public async findOne(id: number): Promise<Artist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id, status: Status.REVIEW },
    });
  }

  public async getAvatar(id: number): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id,
        status: Status.REVIEW,
      },
      select: { avatar: true },
    });

    return await this.file.getFile(
      id,
      RoleType.Artist,
      FileType.Avatar,
      avatar,
    );
  }

  public async getCover(id: number): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
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
      await this.prisma.artist.update({
        data: {
          status: {
            set: Status.APPROVED,
          },
          user: {
            update: {
              role: Role.ARTIST,
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

  public async decline(id: number): Promise<Success> {
    try {
      await this.prisma.artist.update({
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
          albums: {
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
