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

import type { IPlaylist } from './playlist.interface';
import type { ISuccess } from '@interfaces/response';

import { CreatePlaylistDto, UpdatePlaylistDto } from './playlist.dto';
import { UserPlaylistService } from './playlist.service';

@Controller('api/user/playlists')
export class UserPlaylistController {
  constructor(private readonly userPlaylistService: UserPlaylistService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  public async create(
    @Body() data: CreatePlaylistDto,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.create(data, cover);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Get()
  public async findAll(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IPlaylist[]> {
    try {
      return await this.userPlaylistService.findAll(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':playlistId')
  public async findOne(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.findOne(playlistId, userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':playlistId')
  @UseInterceptors(FileInterceptor('cover'))
  public async update(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() payload: UpdatePlaylistDto,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.update(playlistId, payload, cover);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':playlistId')
  public async delete(
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userPlaylistService.delete(playlistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch(':playlistId/:songId')
  public async addSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.addSong(playlistId, userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete(':playlistId/:songId')
  public async deleteSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.deleteSong(
        playlistId,
        userId,
        songId,
      );
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
