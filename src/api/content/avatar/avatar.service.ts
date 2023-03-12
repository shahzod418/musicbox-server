import { Injectable } from '@nestjs/common';

import { getArtistContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Role } from '@prisma/client';

@Injectable()
export class ContentAvatarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getUserAvatar(userId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        avatar: true,
      },
    });

    if (!avatar) {
      throw new NotFoundError(FileType.Avatar);
    }

    return await this.file.getFile(
      userId,
      RoleType.User,
      FileType.Avatar,
      avatar,
    );
  }

  public async getArtistAvatar(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
      select: {
        avatar: true,
      },
    });

    if (!avatar) {
      throw new NotFoundError(FileType.Avatar);
    }

    return await this.file.getFile(
      artistId,
      RoleType.Artist,
      FileType.Avatar,
      avatar,
    );
  }
}
