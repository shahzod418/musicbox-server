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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PrismaClientError } from '@errors/prisma';

import type { IAlbum, ISong } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { CreateAlbumDto, UpdateAlbumDto } from './album.dto';
import { ArtistAlbumService } from './album.service';

@Controller('api/artist/albums')
export class ArtistAlbumController {
  constructor(private readonly artistAlbumService: ArtistAlbumService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  public async create(
    @Body() data: CreateAlbumDto,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IAlbum> {
    try {
      return await this.artistAlbumService.create(data, cover);
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
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum & ISong> {
    try {
      return await this.artistAlbumService.findOne(albumId, artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':albumId')
  @UseInterceptors(FileInterceptor('cover'))
  public async update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body() data: UpdateAlbumDto,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IAlbum> {
    try {
      return await this.artistAlbumService.update(albumId, data, cover);
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
