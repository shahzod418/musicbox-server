import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

import type { IUpdateUser, IUser } from './profile.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class UserProfileService {
  private readonly profileSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findOne(userId: number): Promise<IUser> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: this.profileSelect,
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
      select: this.profileSelect,
    });

    if (avatar) {
      const updateAvatarArgs = {
        id: userId,
        role: Role.User,
        type: FileType.Avatar,
        currentFile: avatar,
        previousFilename: previousAvatar,
      };

      await this.file.updateFile(updateAvatarArgs);
    }

    return user;
  }

  public async removeAvatar(userId: number): Promise<ISuccess> {
    const { avatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    if (avatar) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: { set: null } },
      });

      const removeAvatarArgs = {
        id: userId,
        role: Role.User,
        type: FileType.Avatar,
        filename: avatar,
      };

      await this.file.removeFile(removeAvatarArgs);
    }

    return { success: true };
  }
}
