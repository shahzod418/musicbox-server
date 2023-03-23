import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import { FileNotFoundError } from '@errors/file';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@guards/optional-jwt-auth.guard';

import { ContentCoverService } from './cover.service';

@Controller('api/content')
export class ContentCoverController {
  constructor(private readonly contentCoverService: ContentCoverService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('songs/:songId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getSongCover(
    @Param('songId', ParseIntPipe) songId: number,
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentCoverService.getSongCover(
        songId,
        userId,
        role,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('albums/:albumId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getAlbumCover(
    @Param('albumId', ParseIntPipe) albumId: number,
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentCoverService.getAlbumCover(
        albumId,
        userId,
        role,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('artists/:artistId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getArtistCover(
    @Param('artistId', ParseIntPipe) artistId: number,
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentCoverService.getArtistCover(
        artistId,
        userId,
        role,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('playlists/:playlistId/cover')
  @Header('Content-Type', 'image/jpeg')
  public async getPlaylistCover(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @UserId() userId: number,
  ): Promise<StreamableFile> {
    try {
      await this.contentCoverService.accessPlaylist(userId, playlistId);

      const file = await this.contentCoverService.getPlaylistCover(
        userId,
        playlistId,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
