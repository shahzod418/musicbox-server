import { ForbiddenException, Injectable } from '@nestjs/common';

import { getPrismaWhere } from '@constants/prisma-where';
import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import type { Role } from '@prisma/client';

@Injectable()
export class BaseUserService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly file: FileService,
  ) {}

  public async accessSong(
    userId: number,
    songId: number,
    role: Role,
  ): Promise<void> {
    try {
      await this.prisma.song.findFirstOrThrow({
        where: { id: songId, ...getPrismaWhere(userId, role) },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  public async accessAlbum(
    userId: number,
    albumId: number,
    role: Role,
  ): Promise<void> {
    try {
      await this.prisma.album.findFirstOrThrow({
        where: { id: albumId, ...getPrismaWhere(userId, role) },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  public async accessArtist(
    userId: number,
    artistId: number,
    role: Role,
  ): Promise<void> {
    try {
      await this.prisma.artist.findFirstOrThrow({
        where: { id: artistId, ...getPrismaWhere(userId, role) },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  public async accessPlaylist(
    userId: number,
    playlistId: number,
  ): Promise<void> {
    try {
      await this.prisma.playlist.findFirstOrThrow({
        where: { id: playlistId, userId },
      });
    } catch {
      throw new ForbiddenException();
    }
  }
}
