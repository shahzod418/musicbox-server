import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ManagerAlbumService {
  private readonly albumSelect = {
    id: true,
    name: true,
    cover: true,
    status: true,
    artist: { select: { id: true, name: true } },
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(artistId: number): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId, status: Status.Review },
      select: this.albumSelect,
    });
  }

  public async findOne(albumId: number): Promise<IAlbum> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, status: Status.Review },
      select: this.albumSelect,
    });
  }

  public async approve(albumId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: { status: { set: Status.Approved } },
      where: { id: albumId },
    });

    return { success: true };
  }

  public async decline(albumId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: {
        status: { set: Status.Declined },
        songs: {
          updateMany: {
            data: { status: { set: Status.Declined } },
            where: { albumId },
          },
        },
      },
      where: { id: albumId },
    });

    return { success: true };
  }
}
