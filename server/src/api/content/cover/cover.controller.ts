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

import { NotFoundError } from '@errors/not-found';
import { PrismaClientError } from '@errors/prisma';

import { ContentCoverService } from './cover.service';

@Controller('api/content')
export class ContentCoverController {
  constructor(private readonly contentCoverService: ContentCoverService) {}

  @Get('songs/:songId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getSongCover(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentCoverService.getSongCover(
        songId,
        Role.ADMIN,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
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
      const file = await this.contentCoverService.getAlbumCover(
        albumId,
        Role.ADMIN,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
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
      const file = await this.contentCoverService.getArtistCover(
        artistId,
        Role.ADMIN,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
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
      const file = await this.contentCoverService.getPlaylistCover(playlistId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
