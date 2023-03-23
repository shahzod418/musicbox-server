import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { BaseContentService } from '@base/content.service';
import {
  getArtistContentWhere,
  getContentWhere,
} from '@constants/content-where';

import { FileType } from '@interfaces/file';

@Injectable()
export class ContentCoverService extends BaseContentService {
  public async getSongCover(
    songId: number,
    userId?: number,
    role?: Role,
  ): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.song.findFirstOrThrow({
      where: { id: songId, ...getContentWhere(userId, role) },
      select: { artistId: true, cover: true },
    });

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
    userId?: number,
    role?: Role,
  ): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, ...getContentWhere(userId, role) },
      select: { artistId: true, cover: true },
    });

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
    userId?: number,
    role?: Role,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(userId, role) },
      select: { cover: true },
    });

    const getCoverArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }

  public async getPlaylistCover(
    userId: number,
    playlistId: number,
  ): Promise<Buffer> {
    const { cover } = await this.prisma.playlist.findFirstOrThrow({
      where: { id: playlistId, userId },
      select: { cover: true },
    });

    const getCoverArgs = {
      id: playlistId,
      role: Role.User,
      type: FileType.Cover,
      filename: cover,
    };

    return await this.file.getFile(getCoverArgs);
  }
}
