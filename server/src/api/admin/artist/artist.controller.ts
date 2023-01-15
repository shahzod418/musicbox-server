import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

import { AdminArtistService } from './artist.service';

@Controller('api/admin/artists')
export class AdminArtistController {
  constructor(private readonly adminArtistService: AdminArtistService) {}

  @Get()
  public async findAll(): Promise<IArtist[]> {
    try {
      return await this.adminArtistService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Delete(':artistId')
  public async remove(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminArtistService.remove(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
