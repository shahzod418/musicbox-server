import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminSongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<ISong[]> {
    return await this.prisma.song.findMany();
  }

  public async remove(songId: number): Promise<ISuccess> {
    const { artistId, audio } = await this.prisma.song.delete({
      where: { id: songId },
      select: { artistId: true, audio: true },
    });

    await this.file.removeFile(
      artistId,
      RoleType.Artist,
      FileType.Audio,
      audio,
    );

    return { success: true };
  }
}
