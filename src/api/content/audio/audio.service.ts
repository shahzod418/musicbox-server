import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType } from '@interfaces/file';

import type { IAudioStream } from './audio.interface';

@Injectable()
export class ContentAudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async getAudio(
    songId: number,
    range?: string,
    role?: Role,
    userId?: number,
  ): Promise<IAudioStream> {
    const { artistId, audio } = await this.prisma.song.findFirstOrThrow({
      where: { id: songId, ...getContentWhere(role, userId) },
      select: { artistId: true, audio: true },
    });

    if (!audio) {
      throw new NotFoundError(FileType.Audio);
    }

    const getSizeArgs = {
      id: artistId,
      role: Role.Artist,
      type: FileType.Audio,
      filename: audio,
    };

    const size = await this.file.getSize(getSizeArgs);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts.at(0), 10);
      const end = parts.at(1) ? parseInt(parts.at(1), 10) : size - 1;

      const stream = this.file.createAudioStream({
        id: artistId,
        filename: audio,
        start,
        end,
      });

      return { stream, size, start, end };
    }

    const stream = this.file.createAudioStream({
      id: artistId,
      filename: audio,
    });

    return { stream, size };
  }
}
