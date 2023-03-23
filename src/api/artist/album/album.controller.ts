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
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IAlbum, ISong } from './album.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

import { ICreateAlbumBody, IUpdateAlbum } from './album.interface';

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
    @UserId() userId: number,
    @Body(new ValidationBodyPipe(createAlbumSchema)) data: ICreateAlbumBody,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IAlbum> {
    try {
      const artistId = await this.artistAlbumService.getArtistId(userId);

      return await this.artistAlbumService.create(
        { ...data, artistId },
        files.cover,
      );
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
  public async findAll(@UserId() userId: number): Promise<IAlbum[]> {
    try {
      const artistId = await this.artistAlbumService.getArtistId(userId);

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
    @UserId() userId: number,
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbum & ISong> {
    try {
      await this.artistAlbumService.accessAlbum(userId, albumId);

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
    @UserId() userId: number,
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body(new ValidationBodyPipe(updateAlbumSchema)) data: IUpdateAlbum,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IAlbum> {
    try {
      await this.artistAlbumService.accessAlbum(userId, albumId);

      return await this.artistAlbumService.update(albumId, data, files.cover);
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

  @Delete(':albumId')
  public async remove(
    @UserId() userId: number,
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      await this.artistAlbumService.accessAlbum(userId, albumId);

      return await this.artistAlbumService.remove(albumId);
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

  @Patch(':albumId/:songId')
  public async addSong(
    @UserId() userId: number,
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.artistAlbumService.accessAlbum(userId, albumId);
      await this.artistAlbumService.accessSong(userId, songId);

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
    @UserId() userId: number,
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.artistAlbumService.accessAlbum(userId, albumId);
      await this.artistAlbumService.accessSong(userId, songId);

      return await this.artistAlbumService.removeSong(albumId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
