import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '@decorators/users.decorator';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { UserAlbumService } from './album.service';

@UseGuards(JwtAuthGuard)
@Controller('api/user/albums')
export class UserAlbumController {
  constructor(private readonly userAlbumService: UserAlbumService) {}

  @Get()
  public async findAll(@UserId() userId: number): Promise<IAlbum[]> {
    try {
      return await this.userAlbumService.findAll(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Put()
  public async addAlbum(
    @UserId() userId: number,
    @Body('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userAlbumService.addAlbum(userId, albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        if (error.meta?.target) {
          throw new BadRequestException('Album already added');
        }
        throw new BadRequestException('Album not found');
      }

      throw error;
    }
  }

  @Delete()
  public async removeAlbum(
    @UserId() userId: number,
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
