import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  StreamableFile,
} from '@nestjs/common';

import type { Song } from '@prisma/client';

import { SongService } from './song.service';

@Controller('api/music/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  public async findAll(): Promise<Song[]> {
    return await this.songService.findAll();
  }

  @Get(':songId')
  public async findOne(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Song> {
    return await this.songService.findOne(songId);
  }

  @Get(':songId/audio')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'audio/mpeg')
  public async getAudio(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<StreamableFile> {
    const file = await this.songService.getAudio(songId);

    return new StreamableFile(file);
  }

  @Get(':songId/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<StreamableFile> {
    const file = await this.songService.getCover(songId);

    return new StreamableFile(file);
  }

  @Patch(':songId/listens')
  public async addListens(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<void> {
    return await this.songService.addListens(songId);
  }
}
