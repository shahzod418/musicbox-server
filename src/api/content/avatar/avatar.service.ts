import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getArtistContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

@Injectable()
export class ContentAvatarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getUserAvatar(userId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!avatar) {
      throw new NotFoundError(FileType.Avatar);
    }

    const getAvatarArgs = {
      id: userId,
      role: Role.User,
      type: FileType.Avatar,
      filename: avatar,
    };

    return await this.file.getFile(getAvatarArgs);
  }

  public async getArtistAvatar(
    artistId: number,
    role?: Role,
    userId?: number,
  ): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getArtistContentWhere(role, userId) },
      select: { avatar: true },
    });

    if (!avatar) {
      throw new NotFoundError(FileType.Avatar);
    }

    const getAvatarArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Avatar,
      filename: avatar,
    };

    return await this.file.getFile(getAvatarArgs);
  }
}
