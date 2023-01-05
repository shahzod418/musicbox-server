import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Success } from '@interfaces/response';
import type { Album as IAlbum } from '@prisma/client';

import { IAlbumCreateInput, IAlbumUpdateInput } from './album.schema';
import { AlbumService } from './album.service';

@Controller('api/artist/albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  public async create(
    @Body() data: IAlbumCreateInput,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IAlbum> {
    return await this.albumService.create(data, cover);
  }

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum[]> {
    return await this.albumService.findAll(artistId);
  }

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum> {
    return await this.albumService.findOne(albumId, artistId);
  }

  @Patch(':albumId')
  @UseInterceptors(FileInterceptor('cover'))
  public async update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body() data: IAlbumUpdateInput,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IAlbum> {
    return await this.albumService.update(albumId, data, cover);
  }

  @Delete(':albumId')
  public async remove(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<Success> {
    return await this.albumService.remove(albumId);
  }

  @Patch(':albumId/:songId')
  public async addSong(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Success> {
    return await this.albumService.addSong(albumId, songId);
  }

  @Delete(':albumId/:songId')
  public async removeSong(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Success> {
    return await this.albumService.removeSong(albumId, songId);
  }
}
