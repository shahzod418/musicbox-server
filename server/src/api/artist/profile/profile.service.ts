import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type {
  IArtist,
  IArtistFiles,
  ICreateArtist,
  IUpdateArtist,
} from './profile.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ArtistProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(
    data: ICreateArtist,
    files: IArtistFiles,
  ): Promise<IArtist> {
    const { userId, ...payload } = data;
    const { avatar, cover } = files;

    const artist = await this.prisma.artist.create({
      data: {
        ...payload,
        userId,
        ...(avatar && { avatar: avatar.originalname }),
        ...(cover && { cover: cover.originalname }),
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
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

  public async findOne(artistId: number, userId: number): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
        userId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
      },
    });
  }

  public async update(
    artistId: number,
    data: IUpdateArtist,
    files: IArtistFiles,
  ): Promise<IArtist> {
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
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
      },
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

  public async remove(artistId: number): Promise<ISuccess> {
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
  }
}
