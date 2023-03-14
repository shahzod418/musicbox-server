import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import { PrismaClientError } from '@errors/prisma';
import { OptionalJwtAuthGuard } from '@guards/optional-jwt-auth.guard';

import type { IAlbum, IArtist, IArtistShort, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';

import { ContentArtistService } from './artist.service';

@UseGuards(OptionalJwtAuthGuard)
@Controller('api/content/artists')
export class ContentArtistController {
  constructor(private readonly contentArtistService: ContentArtistService) {}

  @Get()
  public async findAll(
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IArtistShort[]> {
    try {
      return await this.contentArtistService.findAll(userId, role);
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IArtist> {
    try {
      return await this.contentArtistService.findOne(artistId, userId, role);
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IAlbum[]> {
    try {
      return await this.contentArtistService.findAllAlbum(
        artistId,
        userId,
        role,
      );
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    try {
      return await this.contentArtistService.findOneAlbum(
        albumId,
        userId,
        role,
      );
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
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<ISong[]> {
    try {
      return await this.contentArtistService.findAllSong(
        artistId,
        userId,
        role,
      );
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
