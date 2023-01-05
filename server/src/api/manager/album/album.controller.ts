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

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Album> {
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

  @Patch(':albumId/approve')
  public async approve(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Success> {
    return await this.albumService.approve(albumId);
  }

  @Patch(':albumId/decline')
  public async decline(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Success> {
    return await this.albumService.decline(albumId);
  }
}
