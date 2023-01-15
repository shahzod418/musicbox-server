import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IArtist, IArtistWithAlbumsAndSongs } from './artist.interface';

import { MusicArtistService } from './artist.service';

@Controller('api/music/artists')
export class MusicArtistController {
  constructor(private readonly musicArtistService: MusicArtistService) {}

  @Get()
  public async findAll(): Promise<IArtist[]> {
    try {
      return await this.musicArtistService.findAll();
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
  ): Promise<IArtistWithAlbumsAndSongs> {
    try {
      return await this.musicArtistService.findOne(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
