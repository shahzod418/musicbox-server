import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Album, Prisma } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: Pick<Prisma.AlbumCreateInput, 'name'> & {
      artistId: number;
    },
    cover?: Express.Multer.File,
  ): Promise<Album> {
    const { artistId, ...payload } = data;

    const album = await this.prisma.album.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.originalname }),
        artist: {
          connect: {
            id: artistId,
          },
        },
      },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);
    }

    return album;
  }

  public async findAll(artistId: number): Promise<Album[]> {
    return await this.prisma.album.findMany({ where: { artistId } });
  }

  public async findOne(albumId: number, artistId: number): Promise<Album> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId, artistId },
    });
  }

  public async update(
    albumId: number,
    data: Pick<Prisma.AlbumUpdateInput, 'name'>,
    cover?: Express.Multer.File,
  ): Promise<Album> {
    const album = await this.prisma.album.update({
      data: {
        ...data,
        ...(cover && {
          cover: {
            set: cover.originalname,
          },
        }),
        status: {
          set: Status.REVIEW,
        },
      },
      where: {
        id: albumId,
      },
    });

    if (cover) {
      await this.file.addFile(
        album.artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
      await this.file.removeFile(
        album.artistId,
        RoleType.Artist,
        FileType.Cover,
        album.cover,
      );
    }

    return album;
  }

  public async remove(albumId: number): Promise<Success> {
    try {
      await this.prisma.album.update({
        data: {
          status: {
            set: Status.DELETED,
          },
        },
        where: {
          id: albumId,
        },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async addSong(albumId: number, songId: number): Promise<Success> {
    try {
      await this.prisma.album.update({
        data: {
          songs: {
            connect: {
              id: songId,
            },
          },
        },
        where: {
          id: albumId,
        },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async removeSong(albumId: number, songId: number): Promise<Success> {
    try {
      await this.prisma.album.update({
        data: {
          songs: {
            disconnect: {
              id: songId,
            },
          },
        },
        where: {
          id: albumId,
        },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
