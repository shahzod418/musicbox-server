import { Injectable } from '@nestjs/common';

import { BaseUserService } from '@base/user.service';
import { getPrismaWhere } from '@constants/prisma-where';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';
import type { Role } from '@prisma/client';

@Injectable()
export class UserArtistService extends BaseUserService {
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

  public async findAll(userId: number, role: Role): Promise<IArtist[]> {
    const { artists } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        artists: {
          ...this.artistSelect,
          where: getPrismaWhere(userId, role),
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
