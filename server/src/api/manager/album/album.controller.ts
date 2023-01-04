import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  StreamableFile,
} from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Album } from '@prisma/client';

import { AlbumService } from './album.service';

@Controller('api/manager/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<Album[]> {
    return await this.albumService.findAll(artistId);
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Album> {
    return await this.albumService.findOne(id);
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

  @Patch(':id/approve')
  public async approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.albumService.approve(id);
  }

  @Patch(':id/decline')
  public async decline(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.albumService.decline(id);
  }
}
