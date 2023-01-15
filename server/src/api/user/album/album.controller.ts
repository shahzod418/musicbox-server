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

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { UserAlbumService } from './album.service';

@Controller('api/user/albums')
export class UserAlbumController {
  constructor(private readonly userAlbumService: UserAlbumService) {}

  @Get()
  public async findAll(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IAlbum[]> {
    try {
      return await this.userAlbumService.findAll(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch()
  public async addAlbum(
    @Query('userId', ParseIntPipe) userId: number,
    @Body('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userAlbumService.addAlbum(userId, albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete()
  public async removeAlbum(
    @Query('userId', ParseIntPipe) userId: number,
    @Body('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userAlbumService.removeAlbum(userId, albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
