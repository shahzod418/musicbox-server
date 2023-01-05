import {
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

import type { Success } from '@interfaces/response';
import type { Playlist } from '@prisma/client';

import { PlaylistCreateInput, PlaylistUpdateInput } from './playlist.schema';
import { PlaylistService } from './playlist.service';

@Controller('api/user/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  public async create(
    @Body() data: PlaylistCreateInput,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<Playlist> {
    return await this.playlistService.create(data, cover);
  }

  @Get()
  public async findAll(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist[]> {
    return await this.playlistService.findAll(userId);
  }

  @Get(':playlistId')
  public async findOne(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.findOne(playlistId, userId);
  }

  @Patch(':playlistId')
  @UseInterceptors(FileInterceptor('cover'))
  public async update(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Body() payload: PlaylistUpdateInput,
    @UploadedFile() cover?: Express.Multer.File,
  ): Promise<Playlist> {
    return await this.playlistService.update(playlistId, payload, cover);
  }

  @Delete(':playlistId')
  public async delete(
    @Param('playlistId', ParseIntPipe) playlistId: number,
  ): Promise<Success> {
    return await this.playlistService.delete(playlistId);
  }

  @Patch(':playlistId/:songId')
  public async addSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.addSong(playlistId, userId, songId);
  }

  @Delete(':playlistId/:songId')
  public async deleteSong(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('songId', ParseIntPipe) songId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.deleteSong(playlistId, userId, songId);
  }
}
