import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

@Injectable()
export class AvatarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getUserAvatar(userId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: { avatar: true },
    });

    return await this.file.getFile(
      userId,
      RoleType.User,
      FileType.Avatar,
      avatar,
    );
  }

  public async getArtistAvatar(artistId: number): Promise<Buffer> {
    const { avatar } = await this.prisma.artist.findFirstOrThrow({
      where: {
        id: artistId,
      },
      select: { avatar: true },
    });

    return await this.file.getFile(
      artistId,
      RoleType.User,
      FileType.Avatar,
      avatar,
    );
  }
}
