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

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Song> {
    return await this.songService.findOne(id);
  }

  @Get(':id/audio')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'audio/mpeg')
  public async getAudio(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.songService.getAudio(id);

    return new StreamableFile(file);
  }

  @Get(':id/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.songService.getCover(id);

    return new StreamableFile(file);
  }

  @Patch(':id/listens')
  public async addListens(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.songService.addListens(id);
  }
}
