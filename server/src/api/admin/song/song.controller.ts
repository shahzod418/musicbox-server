import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import { AdminSongService } from './song.service';

@Controller('api/admin/songs')
export class AdminSongController {
  constructor(private readonly adminSongService: AdminSongService) {}

  @Get()
  public async findAll(): Promise<ISong[]> {
    try {
      return await this.adminSongService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Delete(':songId')
  public async remove(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminSongService.remove(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
