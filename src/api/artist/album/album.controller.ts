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
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IAlbum, ISong } from './album.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

import { ICreateAlbum, IUpdateAlbum } from './album.interface';

import { ArtistAlbumService } from './album.service';
import { createAlbumSchema, updateAlbumSchema } from './album.validation';

@UseGuards(RolesGuard)
@Roles(Role.Artist)
@UseGuards(JwtAuthGuard)
@Controller('api/artist/albums')
export class ArtistAlbumController {
  constructor(private readonly artistAlbumService: ArtistAlbumService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async create(
    @Body(new ValidationBodyPipe(createAlbumSchema)) data: ICreateAlbum,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IAlbum> {
    try {
      return await this.artistAlbumService.create(data, files.cover);
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
  ): Promise<IAlbum[]> {
    try {
      return await this.artistAlbumService.findAll(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbum & ISong> {
    try {
      return await this.artistAlbumService.findOne(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':albumId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body(new ValidationBodyPipe(updateAlbumSchema)) data: IUpdateAlbum,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IAlbum> {
    try {
      return await this.artistAlbumService.update(albumId, data, files.cover);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':albumId')
  public async remove(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistAlbumService.remove(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':albumId/:songId')
  public async addSong(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistAlbumService.addSong(albumId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':albumId/:songId')
  public async removeSong(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistAlbumService.removeSong(albumId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
