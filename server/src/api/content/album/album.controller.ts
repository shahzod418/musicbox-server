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

import type { IAlbum, ISong } from './album.interface';

import { ContentAlbumService } from './album.service';

@UseGuards(OptionalJwtAuthGuard)
@Controller('api/content/albums')
export class ContentAlbumController {
  constructor(private readonly contentAlbumService: ContentAlbumService) {}

  @Get()
  public async findAll(
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IAlbum[]> {
    try {
      return await this.contentAlbumService.findAll(role, userId);
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IAlbum & { songs: ISong[] }> {
    try {
      return await this.contentAlbumService.findOne(albumId, role, userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
