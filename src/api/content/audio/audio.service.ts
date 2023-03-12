import { Injectable } from '@nestjs/common';

import { getContentWhere } from '@constants/content-where';
import { PrismaService } from '@database/prisma.service';
import { NotFoundError } from '@errors/not-found';
import { FileService } from '@services/file/file.service';

import { FileType, RoleType } from '@interfaces/file';

import type { IAudioStream } from './audio.interface';
import type { Role } from '@prisma/client';

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
      select: {
        artistId: true,
        audio: true,
      },
    });

    if (!audio) {
      throw new NotFoundError(FileType.Audio);
    }

    const size = await this.file.getSize(
      artistId,
      RoleType.Artist,
      FileType.Audio,
      audio,
    );

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts.at(0), 10);
      const end = parts.at(1) ? parseInt(parts.at(1), 10) : size - 1;

      const stream = this.file.createAudioStream(artistId, audio, start, end);

      return { stream, size, start, end };
    }

    const stream = this.file.createAudioStream(artistId, audio);

    return { stream, size };
  }
}
