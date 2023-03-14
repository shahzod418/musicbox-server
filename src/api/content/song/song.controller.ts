import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<ISong[]> {
    try {
      return await this.contentSongService.findAll(userId, role);
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<ISong> {
    try {
      return await this.contentSongService.findOne(songId, userId, role);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
