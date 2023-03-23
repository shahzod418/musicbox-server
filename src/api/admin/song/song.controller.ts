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
  ICreateSong,
  ICreateSongFiles,
  IUpdateSong,
  IUpdateSongFiles,
} from './song.interface';

import { AdminSongService } from './song.service';
import { createSongSchema, updateSongSchema } from './song.validation';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard)
@Controller('api/admin/songs')
export class AdminSongController {
  constructor(private readonly adminSongService: AdminSongService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body(new ValidationBodyPipe(createSongSchema)) data: ICreateSong,
    @UploadedFiles(new ParseAudioPipe(), new ParseCoverPipe({ optional: true }))
    files: ICreateSongFiles,
  ): Promise<ISong> {
    try {
      return await this.adminSongService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException('Song not created');
      }

      if (error instanceof FileNotRecordError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Get(':songId')
  public async findOne(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISong> {
    try {
      return await this.adminSongService.findOne(songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
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
    @Body(new ValidationBodyPipe(updateSongSchema)) data: IUpdateSong,
    @UploadedFiles(
      new ParseAudioPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IUpdateSongFiles,
  ): Promise<ISong> {
    try {
      return await this.adminSongService.update(songId, data, files);
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
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminSongService.remove(songId);
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

  @Delete(':songId/cover')
  public async removeCover(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminSongService.removeCover(songId);
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
