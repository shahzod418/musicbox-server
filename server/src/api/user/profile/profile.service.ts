import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { IUpdateUser, IUser } from './profile.interface';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findOne(userId: number): Promise<IUser> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });
  }

  public async update(
    userId: number,
    data: IUpdateUser,
    avatar?: Express.Multer.File,
  ): Promise<IUser> {
    const { avatar: previousAvatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    const user = await this.prisma.user.update({
      data: {
        ...data,
        ...(avatar && {
          avatar: {
            set: avatar.originalname,
          },
        }),
      },
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });

    if (avatar) {
      await this.file.updateFile(
        userId,
        RoleType.User,
        FileType.Avatar,
        avatar,
        previousAvatar,
      );
    }

    return user;
  }
}
