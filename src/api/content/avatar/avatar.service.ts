import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getPrismaArtistWhere } from '@constants/prisma-where';
import { PrismaService } from '@database/prisma.service';
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
    userId?: number,
    role?: Role,
  ): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId, ...getPrismaArtistWhere(userId, role) },
      select: { avatar: true },
    });

    const getAvatarArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Avatar,
      filename: avatar,
    };

    return await this.file.getFile(getAvatarArgs);
  }
}
