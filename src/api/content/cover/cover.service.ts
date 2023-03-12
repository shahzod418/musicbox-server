import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import {
  getArtistContentWhere,
  getContentWhere,
} from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

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
      select: { artistId: true, cover: true },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    const getCoverArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }

  public async getAlbumCover(
    albumId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getContentWhere(role, userId) },
      select: { artistId: true, cover: true },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    const getCoverArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }

  public async getArtistCover(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
      select: { cover: true },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    const getCoverArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }

  public async getPlaylistCover(
    playlistId: number,
    userId: number,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: { cover: true },
    });

    if (!cover) {
      throw new NotFoundError(FileType.Cover);
    }

    const getCoverArgs = {
      id: playlistId,
      role: Role.User,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }
}
