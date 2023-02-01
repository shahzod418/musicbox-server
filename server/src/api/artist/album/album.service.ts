import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type {
  IAlbum,
  ICreateAlbum,
  ISong,
  IUpdateAlbum,
} from './album.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ArtistAlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(data: ICreateAlbum, cover?: IFile): Promise<IAlbum> {
    const { artistId, ...payload } = data;

    const album = await this.prisma.album.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.name }),
        artist: { connect: { id: artistId } },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
      },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);
    }

    return album;
  }

  public async findAll(artistId: number): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
      },
    });
  }

  public async findOne(albumId: number): Promise<IAlbum & ISong> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
        songs: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  public async update(
    albumId: number,
    data: IUpdateAlbum,
    cover?: IFile,
  ): Promise<IAlbum> {
    const { artistId, cover: previousCover } =
      await this.prisma.album.findFirstOrThrow({
        where: { id: albumId },
        select: {
          artistId: true,
          cover: true,
        },
      });

    const album = await this.prisma.album.update({
      data: {
        ...data,
        ...(cover && { cover: { set: cover.name } }),
        status: { set: Status.REVIEW },
      },
      where: { id: albumId },
      select: {
        id: true,
        name: true,
        cover: true,
        status: true,
      },
    });

    if (cover) {
      await this.file.updateFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
        previousCover,
      );
    }

    return album;
  }

  public async remove(albumId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: { status: { set: Status.DELETED } },
      where: { id: albumId },
    });

    return { success: true };
  }

  public async addSong(albumId: number, songId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: { songs: { connect: { id: songId } } },
      where: { id: albumId },
    });

    return { success: true };
  }

  public async removeSong(albumId: number, songId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: { songs: { disconnect: { id: songId } } },
      where: { id: albumId },
    });

    return { success: true };
  }
}
