import { Injectable } from '@nestjs/common';

import { getPrismaArtistWhere, getPrismaWhere } from '@constants/prisma-where';
import { PrismaService } from '@database/prisma.service';

import type { IAlbum, IArtist, IArtistShort, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';
import type { Role } from '@prisma/client';

@Injectable()
export class ContentArtistService {
  private readonly artistShortSelect = {
    id: true,
    name: true,
    avatar: true,
    status: true,
  };

  private readonly artistSelect = {
    ...this.artistShortSelect,
    cover: true,
    description: true,
  };

  private readonly albumSelect = {
    id: true,
    name: true,
    cover: true,
    status: true,
  };

  private readonly songSelect = {
    id: true,
    name: true,
    text: true,
    listens: true,
    explicit: true,
    cover: true,
    audio: true,
    status: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId?: number, role?: Role): Promise<IArtistShort[]> {
    return await this.prisma.artist.findMany({
      where: getPrismaArtistWhere(userId, role),
      select: this.artistShortSelect,
    });
  }

  public async findOne(
    artistId: number,
    userId?: number,
    role?: Role,
  ): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getPrismaArtistWhere(userId, role) },
      select: this.artistSelect,
    });
  }

  public async findAllAlbum(
    artistId: number,
    userId?: number,
    role?: Role,
  ): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId, ...getPrismaWhere(userId, role) },
      select: this.albumSelect,
    });
  }

  public async findOneAlbum(
    albumId: number,
    userId?: number,
    role?: Role,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getPrismaWhere(userId, role) },
      select: {
        ...this.albumSelect,
        artist: { select: { id: true, name: true } },
        songs: {
          where: getPrismaWhere(userId, role),
          select: this.songSelect,
        },
      },
    });
  }

  public async findAllSong(
    artistId: number,
    userId?: number,
    role?: Role,
  ): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { artistId, ...getPrismaWhere(userId, role) },
      select: this.songSelect,
    });
  }
}
