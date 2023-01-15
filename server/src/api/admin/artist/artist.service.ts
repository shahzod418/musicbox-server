import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import { FileService } from '@services/file/file.service';

import { RoleType } from '@interfaces/file';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

@Injectable()
export class AdminArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly file: FileService,
  ) {}

  public async findAll(): Promise<IArtist[]> {
    return this.prisma.artist.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        cover: true,
        description: true,
        status: true,
      },
    });
  }

  public async remove(artistId: number): Promise<ISuccess> {
    await this.prisma.artist.delete({ where: { id: artistId } });

    await this.file.removeResources(artistId, RoleType.Artist);

    return { success: true };
  }
}
