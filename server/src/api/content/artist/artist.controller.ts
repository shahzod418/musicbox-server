import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum, IArtist, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';

import { ContentArtistService } from './artist.service';

@Controller('api/content/artists')
export class ContentArtistController {
  constructor(private readonly contentArtistService: ContentArtistService) {}

  @Get()
  public async findAll(): Promise<IArtist[]> {
    try {
      return await this.contentArtistService.findAll();
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
      return await this.contentArtistService.findOne(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/albums')
  public async findAllAlbum(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum[]> {
    try {
      return await this.contentArtistService.findAllAlbum(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/albums/:albumId')
  public async findOneAlbum(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    try {
      return await this.contentArtistService.findOneAlbum(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/songs')
  public async findAllSong(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISong[]> {
    try {
      return await this.contentArtistService.findAllSong(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
