import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Album } from '@prisma/client';

import { AlbumService } from './album.service';

@Controller('api/admin/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  public async findAll(): Promise<Album[]> {
    return await this.albumService.findAll();
  }

  @Delete(':albumId')
  public async remove(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Success> {
    return await this.albumService.remove(albumId);
  }
}
