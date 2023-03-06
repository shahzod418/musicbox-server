import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import { PrismaClientError } from '@errors/prisma';
import { OptionalJwtAuthGuard } from '@guards/optional-jwt-auth.guard';

import type { ISong } from './song.interface';

import { ContentSongService } from './song.service';

@UseGuards(OptionalJwtAuthGuard)
@Controller('api/content/songs')
export class ContentSongController {
  constructor(private readonly contentSongService: ContentSongService) {}

  @Get()
  public async findAll(
    @UserRole() role?: Role,
    @UserId() userId?: number,
  ): Promise<ISong[]> {
    try {
      return await this.contentSongService.findAll(role, userId);
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
    @UserRole() role?: Role,
    @UserId() userId?: number,
  ): Promise<ISong> {
    try {
      return await this.contentSongService.findOne(songId, role, userId);
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
