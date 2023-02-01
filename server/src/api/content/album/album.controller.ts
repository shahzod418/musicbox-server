import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum, ISong } from './album.interface';

import { ContentAlbumService } from './album.service';

@Controller('api/content/albums')
export class ContentAlbumController {
  constructor(private readonly contentAlbumService: ContentAlbumService) {}

  @Get()
  public async findAll(): Promise<IAlbum[]> {
    try {
      return await this.contentAlbumService.findAll();
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
  ): Promise<IAlbum & { songs: ISong[] }> {
    try {
      return await this.contentAlbumService.findOne(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
