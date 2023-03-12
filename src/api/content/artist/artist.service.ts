import { Injectable } from '@nestjs/common';

import {
  getArtistContentWhere,
  getContentWhere,
} from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';

import type { IAlbum, IArtist, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';
import type { Role } from '@prisma/client';

@Injectable()
export class ContentArtistService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(role?: Role, userId?: number): Promise<IArtist[]> {
    return await this.prisma.artist.findMany({
      where: getArtistContentWhere(role, userId),
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

  public async findOne(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
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

  public async findAllAlbum(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId, ...getContentWhere(role, userId) },
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
    role?: Role,
    userId?: number,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getContentWhere(role, userId) },
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
          where: getContentWhere(role, userId),
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

  public async findAllSong(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<ISong[]> {
    return await this.prisma.song.findMany({
      where: { artistId, ...getContentWhere(role, userId) },
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
