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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

import {
  ISongCreateFiles,
  ISongCreateInput,
  ISongUpdateFiles,
  ISongUpdateInput,
} from './song.schema';
import { SongService } from './song.service';

@Controller('api/artist/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body() data: ISongCreateInput,
    @UploadedFiles() files: ISongCreateFiles,
  ): Promise<Song> {
    return await this.songService.create(data, {
      audio: files.audio.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<Song[]> {
    return await this.songService.findAll(artistId);
  }

  @Get(':songId')
  public async findOne(
    @Param('songId', ParseIntPipe) songId: number,
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<Song> {
    return await this.songService.findOne(songId, artistId);
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
    @Query('artistId', ParseIntPipe) artistId: number,
    @Body() data: ISongUpdateInput,
    @UploadedFiles() files: ISongUpdateFiles,
  ): Promise<Song> {
    return await this.songService.update(songId, artistId, data, {
      audio: files?.audio?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Delete(':songId')
  public async remove(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Success> {
    return await this.songService.remove(songId);
  }
}
