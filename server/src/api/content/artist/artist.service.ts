import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum, IArtist, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';

@Injectable()
export class ContentArtistService {
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

  public async findOne(artistId: number): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        cover: true,
        avatar: true,
        description: true,
        status: true,
      },
    });
  }

  public async findAllAlbum(artistId: number): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: {
        artistId,
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
      },
    });
  }

  public async findOneAlbum(
    albumId: number,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
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

  public async findAllSong(artistId: number): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: {
        artistId,
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
    });
  }
}
