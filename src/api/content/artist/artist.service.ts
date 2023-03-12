import { Injectable } from '@nestjs/common';

import {
  getArtistContentWhere,
  getContentWhere,
} from '@constants/content-where';
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

  public async findAll(role?: Role, userId?: number): Promise<IArtistShort[]> {
    return await this.prisma.artist.findMany({
      where: getArtistContentWhere(role, userId),
      select: this.artistShortSelect,
    });
  }

  public async findOne(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
      select: this.artistSelect,
    });
  }

  public async findAllAlbum(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId, ...getContentWhere(role, userId) },
      select: this.albumSelect,
    });
  }

  public async findOneAlbum(
    albumId: number,
    role?: Role,
    userId?: number,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getContentWhere(role, userId) },
      select: {
        ...this.albumSelect,
        artist: { select: { id: true, name: true } },
        songs: {
          where: getContentWhere(role, userId),
          select: this.songSelect,
        },
      },
    });
  }

  public async findAllSong(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { artistId, ...getContentWhere(role, userId) },
      select: this.songSelect,
    });
  }
}
