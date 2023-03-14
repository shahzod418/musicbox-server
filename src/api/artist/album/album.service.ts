import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { BaseArtistService } from '@base/artist.service';

import { FileType } from '@interfaces/file';

import type {
  IAlbum,
  ICreateAlbum,
  ISong,
  IUpdateAlbum,
} from './album.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ArtistAlbumService extends BaseArtistService {
  private readonly albumSelect = {
    id: true,
    name: true,
    cover: true,
    status: true,
  };

  public async create(data: ICreateAlbum, cover?: IFile): Promise<IAlbum> {
    const { artistId, ...payload } = data;

    const album = await this.prisma.album.create({
      data: {
        ...payload,
        ...(cover && { cover: cover.name }),
        artist: { connect: { id: artistId } },
      },
      select: this.albumSelect,
    });

    if (cover) {
      const addCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        file: cover,
      };

      await this.file.addFile(addCoverArgs);
    }

    return album;
  }

  public async findAll(artistId: number): Promise<IAlbum[]> {
    return await this.prisma.album.findMany({
      where: { artistId },
      select: this.albumSelect,
    });
  }

  public async findOne(albumId: number): Promise<IAlbum & ISong> {
    return await this.prisma.album.findFirstOrThrow({
      where: { id: albumId },
      select: {
        ...this.albumSelect,
        songs: { select: { id: true, name: true } },
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
        select: { artistId: true, cover: true },
      });

    const album = await this.prisma.album.update({
      data: {
        ...data,
        ...(cover && { cover: { set: cover.name } }),
        status: { set: Status.Review },
      },
      where: { id: albumId },
      select: this.albumSelect,
    });

    if (cover) {
      const updateCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        currentFile: cover,
        previousFilename: previousCover,
      };

      await this.file.updateFile(updateCoverArgs);
    }

    return album;
  }

  public async remove(albumId: number): Promise<ISuccess> {
    await this.prisma.album.update({
      data: { status: { set: Status.Deleted } },
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
