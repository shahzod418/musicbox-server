import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Artist } from '@prisma/client';

import { ArtistService } from './artist.service';

@Controller('api/admin/artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  public async findAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Delete(':artistId')
  public async remove(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<Success> {
    return await this.artistService.remove(artistId);
  }
}
