import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaClientError } from '@errors/prisma';

import { CoverService } from './cover.service';

@Controller('api')
export class CoverController {
  constructor(private readonly coverService: CoverService) {}

  @Get('songs/:songId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getSongCover(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.coverService.getSongCover(songId, Role.ADMIN);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get('albums/:albumId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getAlbumCover(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.coverService.getAlbumCover(albumId, Role.ADMIN);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get('artists/:artistId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getArtistCover(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.coverService.getArtistCover(artistId, Role.ADMIN);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get('playlists/:playlistId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getPlaylistCover(
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.coverService.getPlaylistCover(playlistId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
