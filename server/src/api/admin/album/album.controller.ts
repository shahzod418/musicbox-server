import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { AdminAlbumService } from './album.service';

@Controller('api/admin/albums')
export class AdminAlbumController {
  constructor(private readonly adminAlbumService: AdminAlbumService) {}

  @Get()
  public async findAll(): Promise<IAlbum[]> {
    try {
      return await this.adminAlbumService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Delete(':albumId')
  public async remove(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminAlbumService.remove(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
