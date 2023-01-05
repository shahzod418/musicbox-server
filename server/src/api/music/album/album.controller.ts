import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';

import type { Album, Song } from '@prisma/client';

import { AlbumService } from './album.service';

@Controller('api/music/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  public async findAll(): Promise<Album[]> {
    return await this.albumService.findAll();
  }

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Album & { songs: Song[] }> {
    return await this.albumService.findOne(albumId);
  }

  @Get(':albumId/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<StreamableFile> {
    const file = await this.albumService.getCover(albumId);

    return new StreamableFile(file);
  }
}
