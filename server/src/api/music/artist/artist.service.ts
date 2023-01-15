import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IArtist, IArtistWithAlbumsAndSongs } from './artist.interface';

@Injectable()
export class MusicArtistService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<IArtist[]> {
    return await this.prisma.artist.findMany({
      where: {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
      },
    });
  }

  public async findOne(artistId: number): Promise<IArtistWithAlbumsAndSongs> {
    return await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
        albums: true,
        songs: true,
      },
    });
  }
}
