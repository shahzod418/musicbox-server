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

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return await this.songService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ISongUpdateInput,
    @UploadedFiles() files: ISongUpdateFiles,
  ): Promise<Song> {
    return await this.songService.update(id, data, {
      audio: files?.audio?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<Success> {
    return await this.songService.remove(id);
  }
}
