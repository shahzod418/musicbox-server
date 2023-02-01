import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserAlbumService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(userId: number): Promise<IAlbum[]> {
    const { albums } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        albums: {
          where: {
            album: {
              OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
            },
          },
          select: {
            album: {
              select: {
                id: true,
                name: true,
                cover: true,
                status: true,
                artist: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
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
