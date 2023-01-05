import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Artist, Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: Pick<Prisma.ArtistCreateInput, 'name' | 'description'> & {
      userId: number;
    },
    files: {
      avatar?: Express.Multer.File;
      cover?: Express.Multer.File;
    },
  ): Promise<Artist> {
    const { userId, ...payload } = data;
    const { avatar, cover } = files;

    const artist = await this.prisma.artist.create({
      data: {
        ...payload,
        userId,
        ...(avatar && { avatar: avatar.originalname }),
        ...(cover && { cover: cover.originalname }),
      },
    });

    if (avatar) {
      await this.file.addFile(
        artist.id,
        RoleType.Artist,
        FileType.Avatar,
        avatar,
      );
    }
    if (cover) {
      await this.file.addFile(
        artist.id,
        RoleType.Artist,
        FileType.Cover,
        cover,
      );
    }

    return artist;
  }

  public async findOne(artistId: number, userId: number): Promise<Artist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        userId,
      },
    });
  }

  public async update(
    artistId: number,
    data: Pick<Prisma.ArtistUpdateInput, 'name' | 'description'>,
    files: {
      avatar?: Express.Multer.File;
      cover?: Express.Multer.File;
    },
  ): Promise<Artist> {
    const { avatar, cover } = files;

    const { avatar: previousAvatar, cover: previousCover } =
      await this.prisma.artist.findUniqueOrThrow({
        where: { id: artistId },
        select: {
          avatar: true,
          cover: true,
        },
      });

    const artist = await this.prisma.artist.update({
      data: {
        ...data,
        ...(avatar && {
          avatar: {
            set: avatar.originalname,
          },
        }),
        ...(cover && {
          cover: {
            set: cover.originalname,
          },
        }),
      },
      where: { id: artistId },
    });

    if (avatar) {
      await this.file.updateFile(
        artistId,
        RoleType.Artist,
        FileType.Avatar,
        avatar,
        previousAvatar,
      );
    }

    if (cover) {
      await this.file.updateFile(
        artistId,
        RoleType.Artist,
        FileType.Cover,
        cover,
        previousCover,
      );
    }

    return artist;
  }

  public async remove(artistId: number): Promise<Success> {
    try {
      await this.prisma.artist.update({
        data: {
          status: { set: Status.DELETED },
          albums: {
            updateMany: {
              where: { artistId },
              data: { status: { set: Status.DELETED } },
            },
          },
          songs: {
            updateMany: {
              where: { artistId },
              data: { status: { set: Status.DELETED } },
            },
          },
        },
        where: { id: artistId },
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  }

  public async getAvatar(artistId: number, userId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        userId,
      },
      select: { avatar: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Avatar,
      avatar,
    );
  }

  public async getCover(artistId: number, userId: number): Promise<Buffer> {
    const { cover } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        userId,
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
}
