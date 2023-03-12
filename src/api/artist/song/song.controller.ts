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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Roles } from '@decorators/roles.decorator';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ParseAudioPipe } from '@pipes/parse-audio';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

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

@UseGuards(RolesGuard)
@Roles(Role.ARTIST)
@UseGuards(JwtAuthGuard)
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
    @Body(new ValidationBodyPipe<ICreateSong>(createSongSchema))
    data: ICreateSong,
    @UploadedFiles(new ParseAudioPipe(), new ParseCoverPipe({ optional: true }))
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
  ): Promise<ISong> {
    try {
      return await this.artistSongService.findOne(songId);
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
    @Body(new ValidationBodyPipe<IUpdateSong>(updateSongSchema))
    data: IUpdateSong,
    @UploadedFiles(
      new ParseAudioPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    try {
      return await this.artistSongService.update(songId, data, files);
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
