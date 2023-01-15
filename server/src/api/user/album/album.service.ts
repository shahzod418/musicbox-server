import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<IAlbum[]> {
    const { albums } = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        albums: {
          select: {
            album: true,
          },
        },
      },
    });

    return albums.map(({ album }) => album);
  }

  public async addAlbum(userId: number, albumId: number): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        albums: {
          connect: {
            userId_albumId: {
              userId,
              albumId,
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });

    return { success: true };
  }

  public async removeAlbum(userId: number, albumId: number): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        albums: {
          disconnect: {
            userId_albumId: {
              userId,
              albumId,
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });

    return { success: true };
  }
}
