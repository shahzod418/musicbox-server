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
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import {
  FileNotRecordError,
  FileNotRemovedError,
  FileNotUpdatedError,
} from '@errors/file';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IPlaylist, ISong } from './playlist.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

import { ICreatePlaylistBody, IUpdatePlaylist } from './playlist.interface';

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
    @UserId() userId: number,
    @Body(new ValidationBodyPipe(createPlaylistSchema))
    data: ICreatePlaylistBody,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IPlaylist> {
    try {
      return await this.userPlaylistService.create(
        { ...data, userId },
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
  public async findAll(@UserId() userId: number): Promise<IPlaylist[]> {
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
    @UserId() userId: number,
    @UserRole() role: Role,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<IPlaylist & { songs: ISong[] }> {
    try {
      await this.userPlaylistService.accessPlaylist(userId, playlistId);

      return await this.userPlaylistService.findOne(playlistId, userId, role);
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
    @UserId() userId: number,
    @UserRole() role: Role,
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body(new ValidationBodyPipe(updatePlaylistSchema))
    payload: IUpdatePlaylist,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: { cover?: IFile },
  ): Promise<IPlaylist & { songs: ISong[] }> {
    try {
      await this.userPlaylistService.accessPlaylist(userId, playlistId);

      return await this.userPlaylistService.update(
        { userId, role },
        { playlistId, ...payload },
        files.cover,
      );
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

  @Delete(':playlistId')
  public async delete(
    @UserId() userId: number,
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<ISuccess> {
    try {
      await this.userPlaylistService.accessPlaylist(userId, playlistId);

      return await this.userPlaylistService.delete(playlistId);
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

  @Put(':playlistId/:songId')
  public async addSong(
    @UserId() userId: number,
    @UserRole() role: Role,
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.userPlaylistService.accessPlaylist(userId, playlistId);
      await this.userPlaylistService.accessSong(userId, songId, role);

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
    @UserId() userId: number,
    @UserRole() role: Role,
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.userPlaylistService.accessPlaylist(userId, playlistId);
      await this.userPlaylistService.accessSong(userId, songId, role);

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
