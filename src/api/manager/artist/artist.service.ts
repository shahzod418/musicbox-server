import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ManagerArtistService {
  private readonly artistSelect = {
    id: true,
    name: true,
    description: true,
    avatar: true,
    cover: true,
    status: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<IArtist[]> {
    return await this.prisma.artist.findMany({
      where: { status: Status.Review },
      select: this.artistSelect,
    });
  }

  public async findOne(artistId: number): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, status: Status.Review },
      select: this.artistSelect,
    });
  }

  public async approve(artistId: number): Promise<ISuccess> {
    await this.prisma.artist.update({
      data: {
        status: { set: Status.Approved },
        user: { update: { role: Role.Artist } },
      },
      where: { id: artistId },
    });

    return { success: true };
  }

  public async decline(artistId: number): Promise<ISuccess> {
    await this.prisma.artist.update({
      data: {
        status: { set: Status.Declined },
        songs: {
          updateMany: {
            data: { status: { set: Status.Declined } },
            where: { artistId },
          },
        },
        albums: {
          updateMany: {
            data: { status: { set: Status.Declined } },
            where: { artistId },
          },
        },
      },
      where: { id: artistId },
    });

    return { success: true };
  }
}
