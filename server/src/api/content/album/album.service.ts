import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum, ISong } from './album.interface';

@Injectable()
export class ContentAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  public async findOne(albumId: number): Promise<IAlbum & { songs: ISong[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: {
        id: albumId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
        songs: {
          where: {
            OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
          },
          select: {
            id: true,
            name: true,
            text: true,
            listens: true,
            explicit: true,
            cover: true,
            audio: true,
            status: true,
          },
        },
      },
    });
  }
}
