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
import { AudioValidationPipe } from '@pipes/audio-validation';
import { BodyValidationPipe } from '@pipes/body-validation';
import { CoverValidationPipe } from '@pipes/cover-validation';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import {
  ICreateSong,
  ICreateSongFiles,
  IUpdateSong,
  IUpdateSongFiles,
} from './song.interface';

import { ArtistSongService } from './song.service';
import { createSongSchema, updateSongSchema } from './song.validation';

@Controller('api/artist/songs')
export class ArtistSongController {
  constructor(private readonly artistSongService: ArtistSongService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body(new BodyValidationPipe<ICreateSong>(createSongSchema))
    data: ICreateSong,
    @UploadedFiles(
      new AudioValidationPipe(),
      new CoverValidationPipe({ optional: true }),
    )
    files: ICreateSongFiles,
  ): Promise<ISong> {
    try {
      return await this.artistSongService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISong[]> {
    try {
      return await this.artistSongService.findAll(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':songId')
  public async findOne(
    @Param('songId', ParseIntPipe) songId: number,
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISong> {
    try {
      return await this.artistSongService.findOne(songId, artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':songId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Param('songId', ParseIntPipe) songId: number,
    @Query('artistId', ParseIntPipe) artistId: number,
    @Body(new BodyValidationPipe<IUpdateSong>(updateSongSchema))
    data: IUpdateSong,
    @UploadedFiles(
      new AudioValidationPipe({ optional: true }),
      new CoverValidationPipe({ optional: true }),
    )
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    try {
      return await this.artistSongService.update(songId, artistId, data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':songId')
  public async remove(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistSongService.remove(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
