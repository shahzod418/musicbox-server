import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { RoleType } from '@interfaces/file';

import type { Success } from '@interfaces/response';
import type { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  public async remove(artistId: number): Promise<Success> {
    try {
      await this.prisma.artist.delete({ where: { id: artistId } });

      await this.file.removeResources(artistId, RoleType.Artist);

      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
