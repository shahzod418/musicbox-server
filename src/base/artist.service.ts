import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

@Injectable()
export class BaseArtistService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly file: FileService,
  ) {}

  public async getArtistId(userId: number): Promise<number> {
    const { id } = await this.prisma.artist.findFirstOrThrow({
      where: { userId },
      select: { id: true },
    });

    return id;
  }

  public async accessSong(userId: number, songId: number): Promise<void> {
    try {
      await this.prisma.song.findFirstOrThrow({
        where: { id: songId, artist: { userId } },
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  public async accessAlbum(userId: number, albumId: number): Promise<void> {
    try {
      await this.prisma.album.findFirstOrThrow({
        where: { id: albumId, artist: { userId } },
      });
    } catch {
      throw new ForbiddenException();
    }
  }
}
