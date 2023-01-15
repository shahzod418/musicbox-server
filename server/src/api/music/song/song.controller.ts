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

import { MusicSongService } from './song.service';

@Controller('api/music/songs')
export class MusicSongController {
  constructor(private readonly musicSongService: MusicSongService) {}

  @Get()
  public async findAll(): Promise<ISong[]> {
    try {
      return await this.musicSongService.findAll();
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
      return await this.musicSongService.findOne(songId);
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
      return await this.musicSongService.addListens(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
