import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserArtistService {
  private readonly artistSelect = {
    select: {
      artist: {
        select: {
          id: true,
          name: true,
          cover: true,
          description: true,
          status: true,
        },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<IArtist[]> {
    const { artists } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        artists: {
          ...this.artistSelect,
          where: getContentWhere(Role.User),
        },
      },
    });

    return artists.map(({ artist }) => artist);
  }

  public async addArtist(userId: number, artistId: number): Promise<ISuccess> {
    await this.prisma.userArtist.create({
      data: {
        user: { connect: { id: userId } },
        artist: { connect: { id: artistId } },
      },
    });

    return { success: true };
  }

  public async removeArtist(
    userId: number,
    artistId: number,
  ): Promise<ISuccess> {
    await this.prisma.userArtist.delete({
      where: { userId_artistId: { userId, artistId } },
    });

    return { success: true };
  }
}
