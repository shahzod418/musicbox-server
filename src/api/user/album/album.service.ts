import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserAlbumService {
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

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<IAlbum[]> {
    const { albums } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        albums: {
          ...this.albumSelect,
          where: { album: getContentWhere(Role.User) },
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
