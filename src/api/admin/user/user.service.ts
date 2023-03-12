import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

import type {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserFiles,
} from './user.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminUserService {
  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatar: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async create(data: ICreateUser, files: IUserFiles): Promise<IUser> {
    const { password, ...payload } = data;
    const { avatar } = files;

    const hashPassword = await hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...payload,
        ...(avatar && { avatar: avatar.name }),
        hash: hashPassword,
      },
      select: this.userSelect,
    });

    if (avatar) {
      const addAvatarArgs = {
        id: user.id,
        role: Role.User,
        type: FileType.Avatar,
        file: avatar,
      };

      await this.file.addFile(addAvatarArgs);
    }

    return user;
  }

  public async findAll(): Promise<IUser[]> {
    return await this.prisma.user.findMany({ select: this.userSelect });
  }

  public async update(
    userId: number,
    data: IUpdateUser,
    files: IUserFiles,
  ): Promise<IUser> {
    const { password, ...payload } = data;
    const { avatar } = files;

    const hashPassword = password ? await hash(password, 10) : '';

    const { avatar: previousAvatar } = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    const user = await this.prisma.user.update({
      data: {
        ...payload,
        ...(hashPassword && { hash: { set: hashPassword } }),
        ...(avatar && { avatar: { set: avatar.name } }),
      },
      where: { id: userId },
      select: this.userSelect,
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

  public async remove(userId: number): Promise<ISuccess> {
    const { artist } = await this.prisma.user.delete({
      where: { id: userId },
      select: { artist: { select: { id: true } } },
    });

    if (artist) {
      await this.file.removeResources(artist.id, Role.Artist);
    }
    await this.file.removeResources(userId, Role.User);

    return { success: true };
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
