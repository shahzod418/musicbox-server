import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import { UserSongService } from './song.service';

@UseGuards(JwtAuthGuard)
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

  @Put()
  public async addSong(
    @Query('userId', ParseIntPipe) userId: number,
    @Body('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userSongService.addSong(userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        if (error.meta?.target) {
          throw new BadRequestException('Song already added');
        }
        throw new BadRequestException('Song not found');
      }

      throw error;
    }
  }

  @Delete()
  public async removeSong(
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
