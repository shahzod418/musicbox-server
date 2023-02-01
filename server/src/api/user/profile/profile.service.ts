import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { IUpdateUser, IUser } from './profile.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

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
    avatar?: IFile,
  ): Promise<IUser> {
    const { avatar: previousAvatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    const user = await this.prisma.user.update({
      data: {
        ...data,
        ...(avatar && { avatar: { set: avatar.name } }),
      },
      where: { id: userId },
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

  public async removeAvatar(userId: number): Promise<ISuccess> {
    const { avatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        avatar: true,
      },
    });

    if (avatar) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: { set: null } },
      });

      await this.file.removeFile(
        userId,
        RoleType.User,
        FileType.Avatar,
        avatar,
      );
    }

    return { success: true };
  }
}
