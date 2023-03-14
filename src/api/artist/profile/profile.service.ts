import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { BaseArtistService } from '@base/artist.service';

import { FileType } from '@interfaces/file';

import type {
  IArtist,
  IArtistFiles,
  ICreateArtist,
  IUpdateArtist,
} from './profile.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class ArtistProfileService extends BaseArtistService {
  private readonly profileSelect = {
    id: true,
    name: true,
    avatar: true,
    cover: true,
    description: true,
    status: true,
  };

  public async create(
    data: ICreateArtist,
    files: IArtistFiles,
  ): Promise<IArtist> {
    const { userId, ...payload } = data;
    const { avatar, cover } = files;

    const artist = await this.prisma.artist.create({
      data: {
        ...payload,
        ...(avatar && { avatar: avatar.name }),
        ...(cover && { cover: cover.name }),
        userId,
      },
      select: this.profileSelect,
    });

    if (avatar) {
      const addAvatarArgs = {
        id: artist.id,
        role: Role.Artist,
        type: FileType.Avatar,
        file: avatar,
      };

      await this.file.addFile(addAvatarArgs);
    }
    if (cover) {
      const addCoverArgs = {
        id: artist.id,
        role: Role.Artist,
        type: FileType.Cover,
        file: cover,
      };

      await this.file.addFile(addCoverArgs);
    }

    return artist;
  }

  public async findOne(artistId: number): Promise<IArtist> {
    return await this.prisma.artist.findFirstOrThrow({
      where: { id: artistId },
      select: this.profileSelect,
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
        select: { avatar: true, cover: true },
      });

    const artist = await this.prisma.artist.update({
      data: {
        ...data,
        ...(avatar && { avatar: { set: avatar.name } }),
        ...(cover && { cover: { set: cover.name } }),
      },
      where: { id: artistId },
      select: this.profileSelect,
    });

    if (avatar) {
      const updateAvatarArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Avatar,
        currentFile: avatar,
        previousFilename: previousAvatar,
      };

      await this.file.updateFile(updateAvatarArgs);
    }

    if (cover) {
      const updateCoverArgs = {
        id: artistId,
        role: Role.Artist,
        type: FileType.Cover,
        currentFile: cover,
        previousFilename: previousCover,
      };

      await this.file.updateFile(updateCoverArgs);
    }

    return artist;
  }

  public async remove(artistId: number): Promise<ISuccess> {
    await this.prisma.artist.update({
      data: {
        status: { set: Status.Deleted },
        albums: {
          updateMany: {
            where: {},
            data: { status: { set: Status.Deleted } },
          },
        },
        songs: {
          updateMany: {
            where: {},
            data: { status: { set: Status.Deleted } },
          },
        },
      },
      where: { id: artistId },
    });

    return { success: true };
  }
}
