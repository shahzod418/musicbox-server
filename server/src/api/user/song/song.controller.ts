import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import { UserSongService } from './song.service';

@Controller('api/user/songs')
export class UserSongController {
  constructor(private readonly userSongService: UserSongService) {}

  @Get()
  public async findAll(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ISong[]> {
    try {
      return await this.userSongService.findAll(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch()
  public async addArtist(
    @Query('userId', ParseIntPipe) userId: number,
    @Body('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userSongService.addSong(userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete()
  public async removeArtist(
    @Query('userId', ParseIntPipe) userId: number,
    @Body('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userSongService.removeSong(userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
