import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

@Injectable()
export class BaseContentService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly file: FileService,
  ) {}

  public async accessPlaylist(
    userId: number,
    playlistId: number,
  ): Promise<void> {
    try {
      await this.prisma.playlist.findFirstOrThrow({
        where: { id: playlistId, userId },
      });
    } catch {
      throw new ForbiddenException();
    }
  }
}
