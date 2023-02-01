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
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IPlaylist, ISong } from './playlist.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

import { ICreatePlaylist, IUpdatePlaylist } from './playlist.interface';

import { UserPlaylistService } from './playlist.service';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
} from './playlist.validation';

@UseGuards(JwtAuthGuard)
@Controller('api/user/playlists')
export class UserPlaylistController {
  constructor(private readonly userPlaylistService: UserPlaylistService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async create(
    @Body(new ValidationBodyPipe(createPlaylistSchema)) data: ICreatePlaylist,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.create(data, files.cover);
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
  ): Promise<IPlaylist & { songs: ISong[] }> {
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async update(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body(new ValidationBodyPipe(updatePlaylistSchema))
    payload: IUpdatePlaylist,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IPlaylist & { songs: ISong[] }> {
    try {
      return await this.userPlaylistService.update(
        playlistId,
        payload,
        files.cover,
      );
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

  @Put(':playlistId/:songId')
  public async addSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userPlaylistService.addSong(playlistId, userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        if (error.meta?.target) {
          throw new BadRequestException('Song already added');
        }
        throw new BadRequestException('Song not found');
      }

      throw error;
    }
  }

  @Delete(':playlistId/:songId')
  public async deleteSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ISuccess> {
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
