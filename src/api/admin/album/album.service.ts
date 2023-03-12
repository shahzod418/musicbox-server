import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type {
  IAlbum,
  IAlbumFiles,
  ICreateAlbum,
  IUpdateAlbum,
} from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminAlbumService {
  private readonly albumSelect = {
    id: true,
    name: true,
    cover: true,
    status: true,
    artist: { select: { id: true, name: true } },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(data: ICreateAlbum, files: IAlbumFiles): Promise<IAlbum> {
    const { artistId, ...payload } = data;
    const { cover } = files;

    const album = await this.prisma.album.create({
      data: {
        ...(cover && { cover: cover.name }),
        ...payload,
        artist: { connect: { id: artistId } },
      },
      select: { ...this.albumSelect },
    });

    if (cover) {
      await this.file.addFile(artistId, RoleType.Artist, FileType.Cover, cover);
    }

    return album;
  }

  public async findOne(albumId: number): Promise<IAlbum> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId },
      select: { ...this.albumSelect },
    });
  }

  public async update(
    albumId: number,
    payload: IUpdateAlbum,
    files: IAlbumFiles,
  ): Promise<IAlbum> {
    const { cover } = files;

    const { artistId, cover: previousCover } =
      await this.prisma.album.findFirstOrThrow({
        where: { id: albumId },
        select: { artistId: true, cover: true },
      });

    const album = await this.prisma.album.update({
      data: {
        ...payload,
        ...(cover && { cover: { set: cover.name } }),
      },
      where: { id: albumId },
      select: { ...this.albumSelect },
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
    const { artistId, cover } = await this.prisma.album.delete({
      where: { id: albumId },
      select: { artistId: true, cover: true },
    });

    await this.file.removeFile(
      artistId,
      RoleType.Artist,
      FileType.Cover,
      cover,
    );

    return { success: true };
  }

  public async removeCover(albumId: number): Promise<ISuccess> {
    const { artistId, cover } = await this.prisma.album.findFirstOrThrow({
      where: { id: albumId },
      select: { artistId: true, cover: true },
    });

    if (cover) {
      await this.prisma.album.update({
        where: { id: albumId },
        data: { cover: { set: null } },
      });

      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
    }

    return { success: true };
  }
}
