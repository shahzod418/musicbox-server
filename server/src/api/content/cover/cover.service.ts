import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

@Injectable()
export class CoverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getSongCover(songId: number, role: Role): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.song.findFirstOrThrow({
      where: {
        id: songId,
        ...(role === Role.USER && {
          OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
        }),
        ...(role === Role.MANAGER && { status: Status.REVIEW }),
      },
      select: { artistId: true, cover: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getAlbumCover(albumId: number, role: Role): Promise<Buffer> {
    const { artistId, cover } = await this.prisma.album.findFirstOrThrow({
      where: {
        id: albumId,
        ...(role === Role.USER && {
          OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
        }),
        ...(role === Role.MANAGER && { status: Status.REVIEW }),
      },
      select: { artistId: true, cover: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getArtistCover(artistId: number, role: Role): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        ...(role === Role.USER && {
          OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
        }),
        ...(role === Role.MANAGER && { status: Status.REVIEW }),
      },
      select: { cover: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );
  }

  public async getPlaylistCover(playlistId: number): Promise<Buffer> {
    const { cover } = await this.prisma.playlist.findFirstOrThrow({
      where: {
        id: playlistId,
      },
      select: { cover: true },
    });

    return await this.file.getFile(
      playlistId,
      RoleType.User,
      FileType.Cover,
      cover,
    );
  }
}
