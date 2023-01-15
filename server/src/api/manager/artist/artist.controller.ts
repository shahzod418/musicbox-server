import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

import { ManagerArtistService } from './artist.service';

@Controller('api/manager/artists')
export class ManagerArtistController {
  constructor(private readonly managerArtistService: ManagerArtistService) {}

  @Get()
  public async findAll(): Promise<IArtist[]> {
    try {
      return await this.managerArtistService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId')
  public async findOne(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<IArtist> {
    try {
      return await this.managerArtistService.findOne(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':artistId/approve')
  public async approve(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerArtistService.approve(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':artistId/decline')
  public async decline(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.managerArtistService.decline(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
