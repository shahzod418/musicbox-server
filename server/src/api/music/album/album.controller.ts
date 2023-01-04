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

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
  ): Promise<Album & { songs: Song[] }> {
    return await this.albumService.findOne(Number(id));
  }

  @Get(':id/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.albumService.getCover(id);

    return new StreamableFile(file);
  }
}
