import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum, IAlbumWithSongs } from './album.interface';

import { MusicAlbumService } from './album.service';

@Controller('api/music/albums')
export class MusicAlbumController {
  constructor(private readonly musicAlbumService: MusicAlbumService) {}

  @Get()
  public async findAll(): Promise<IAlbum[]> {
    try {
      return await this.musicAlbumService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbumWithSongs> {
    try {
      return await this.musicAlbumService.findOne(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
