import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { PrismaClientError } from '@errors/prisma';

import type { IArtist } from './profile.interface';
import type { ISuccess } from '@interfaces/response';

import {
  ArtistFilesDto,
  CreateArtistDto,
  UpdateArtistDto,
} from './profile.dto';
import { ArtistProfileService } from './profile.service';

@Controller('api/artist/profile')
export class ArtistProfileController {
  constructor(private readonly artistProfileService: ArtistProfileService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body() data: CreateArtistDto,
    @UploadedFiles() files: ArtistFilesDto,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.create(data, {
        avatar: files?.avatar?.at(0),
        cover: files?.cover?.at(0),
      });
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get(':artistId')
  public async findOne(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.findOne(artistId, userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':artistId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() data: UpdateArtistDto,
    @UploadedFiles() files: ArtistFilesDto,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.update(artistId, data, {
        avatar: files?.avatar?.at(0),
        cover: files?.cover?.at(0),
      });
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':artistId')
  public async remove(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistProfileService.remove(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
