import { Injectable } from '@nestjs/common';

import {
  getArtistContentWhere,
  getContentWhere,
} from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Role } from '@prisma/client';

@Injectable()
export class ContentCoverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getSongCover(
    songId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.song.findFirstOrThrow({
      where: { id: songId, ...getContentWhere(role, userId) },
      select: {
        artistId: true,
        cover: true,
      },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getAlbumCover(
    albumId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getContentWhere(role, userId) },
      select: {
        artistId: true,
        cover: true,
      },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getArtistCover(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
      select: {
        cover: true,
      },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getPlaylistCover(
    playlistId: number,
    userId: number,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: {
        cover: true,
      },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    return await this.file.getFile(
      playlistId,
      RoleType.User,
      FileType.Cover,
      cover,
    );
  }
}
