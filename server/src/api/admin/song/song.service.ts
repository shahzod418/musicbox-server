import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

@Injectable()
export class SongService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Song[]> {
    return await this.prisma.song.findMany();
  }

  public async remove(id: number): Promise<Success> {
    try {
      const { artistId, audio } = await this.prisma.song.delete({
        where: { id },
        select: { artistId: true, audio: true },
      });

      await this.file.removeFile(
        artistId,
        RoleType.Artist,
        FileType.Audio,
        audio,
      );

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
