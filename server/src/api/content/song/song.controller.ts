import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { ISong } from './song.interface';

import { ContentSongService } from './song.service';

@Controller('api/content/songs')
export class ContentSongController {
  constructor(private readonly contentSongService: ContentSongService) {}

  @Get()
  public async findAll(): Promise<ISong[]> {
    try {
      return await this.contentSongService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':songId')
  public async findOne(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISong> {
    try {
      return await this.contentSongService.findOne(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':songId/listens')
  public async addListens(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<void> {
    try {
      return await this.contentSongService.addListens(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
