import { Injectable } from '@nestjs/common';

import { BaseUserService } from '@base/user.service';
import { getContentWhere } from '@constants/content-where';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';
import type { Role } from '@prisma/client';

@Injectable()
export class UserAlbumService extends BaseUserService {
  private readonly albumSelect = {
    select: {
      album: {
        select: {
          id: true,
          name: true,
          cover: true,
          status: true,
          artist: { select: { id: true, name: true } },
        },
      },
    },
  };

  public async findAll(userId: number, role: Role): Promise<IAlbum[]> {
    const { albums } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        albums: {
          ...this.albumSelect,
          where: { album: getContentWhere(userId, role) },
        },
      },
    });

    return albums.map(({ album }) => album);
  }

  public async addAlbum(userId: number, albumId: number): Promise<ISuccess> {
    await this.prisma.userAlbum.create({
      data: {
        user: { connect: { id: userId } },
        album: { connect: { id: albumId } },
      },
    });

    return { success: true };
  }

  public async removeAlbum(userId: number, albumId: number): Promise<ISuccess> {
    await this.prisma.userAlbum.delete({
      where: { userId_albumId: { userId, albumId } },
    });

    return { success: true };
  }
}
