import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { ManagerAlbumService } from './album.service';

@Controller('api/manager/albums')
export class ManagerAlbumController {
  constructor(private readonly managerAlbumService: ManagerAlbumService) {}

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum[]> {
    try {
      return await this.managerAlbumService.findAll(artistId);
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
  ): Promise<IAlbum> {
    try {
      return await this.managerAlbumService.findOne(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':albumId/approve')
  public async approve(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerAlbumService.approve(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':albumId/decline')
  public async decline(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerAlbumService.decline(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
