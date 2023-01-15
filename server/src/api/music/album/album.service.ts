import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum, IAlbumWithSongs } from './album.interface';

@Injectable()
export class MusicAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
    });
  }

  public async findOne(albumId: number): Promise<IAlbumWithSongs> {
    return await this.prisma.album.findFirstOrThrow({
      where: {
        id: albumId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      include: {
        songs: true,
      },
    });
  }
}
