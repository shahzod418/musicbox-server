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

  public async findOne(artistId: number): Promise<Artist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, status: Status.REVIEW },
    });
  }

  public async getAvatar(artistId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        status: Status.REVIEW,
      },
      select: { avatar: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Avatar,
      avatar,
    );
  }

  public async getCover(artistId: number): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        status: Status.REVIEW,
      },
      select: { cover: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async approve(artistId: number): Promise<Success> {
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
        where: { id: artistId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async decline(artistId: number): Promise<Success> {
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
                artistId,
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
                artistId,
              },
            },
          },
        },
        where: { id: artistId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
