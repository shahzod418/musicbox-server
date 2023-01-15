import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserArtistService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<IArtist[]> {
    const { artists } = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        artists: {
          select: {
            artist: {
              select: {
                id: true,
                name: true,
                avatar: true,
                cover: true,
                description: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return artists.map(({ artist }) => artist);
  }

  public async addArtist(userId: number, artistId: number): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        artists: {
          connect: {
            userId_artistId: {
              userId,
              artistId,
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

  public async removeArtist(
    userId: number,
    artistId: number,
  ): Promise<ISuccess> {
    await this.prisma.user.update({
      data: {
        artists: {
          disconnect: {
            userId_artistId: {
              userId,
              artistId,
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
