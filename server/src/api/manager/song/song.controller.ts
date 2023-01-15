import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import { ManagerSongService } from './song.service';

@Controller('api/manager/songs')
export class ManagerAlbumController {
  constructor(private readonly managerSongService: ManagerSongService) {}

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISong[]> {
    try {
      return await this.managerSongService.findAll(artistId);
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
      return await this.managerSongService.findOne(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':songId/approve')
  public async approve(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerSongService.approve(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':songId/decline')
  public async decline(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerSongService.decline(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':songId/explicit')
  public async updateExplicit(
    @Param('songId', ParseIntPipe) songId: number,
    @Body('explicit', ParseBoolPipe) explicit: boolean,
  ): Promise<ISuccess> {
    try {
      return await this.managerSongService.updateExplicit(songId, explicit);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
