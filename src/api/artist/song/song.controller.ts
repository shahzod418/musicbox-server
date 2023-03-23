import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Roles } from '@decorators/roles.decorator';
import { UserId } from '@decorators/users.decorator';
import {
  FileNotRecordError,
  FileNotRemovedError,
  FileNotUpdatedError,
} from '@errors/file';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ParseAudioPipe } from '@pipes/parse-audio';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import {
  ICreateSongBody,
  ICreateSongFiles,
  IUpdateSong,
  IUpdateSongFiles,
} from './song.interface';

import { ArtistSongService } from './song.service';
import { createSongSchema, updateSongSchema } from './song.validation';

@UseGuards(RolesGuard)
@Roles(Role.Artist)
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
    @UserId() userId: number,
    @Body(new ValidationBodyPipe(createSongSchema)) data: ICreateSongBody,
    @UploadedFiles(new ParseAudioPipe(), new ParseCoverPipe({ optional: true }))
    files: ICreateSongFiles,
  ): Promise<ISong> {
    try {
      const artistId = await this.artistSongService.getArtistId(userId);

      return await this.artistSongService.create({ ...data, artistId }, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotRecordError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Get()
  public async findAll(@UserId() userId: number): Promise<ISong[]> {
    try {
      const artistId = await this.artistSongService.getArtistId(userId);

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
    @UserId() userId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISong> {
    try {
      await this.artistSongService.accessSong(userId, songId);

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
    @UserId() userId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Body(new ValidationBodyPipe(updateSongSchema)) data: IUpdateSong,
    @UploadedFiles(
      new ParseAudioPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    try {
      await this.artistSongService.accessSong(userId, songId);

      return await this.artistSongService.update(songId, data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotUpdatedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Delete(':songId')
  public async remove(
    @UserId() userId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.artistSongService.accessSong(userId, songId);

      return await this.artistSongService.remove(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotRemovedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }
}
