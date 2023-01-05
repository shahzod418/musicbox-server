import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Query,
  StreamableFile,
} from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

import { SongService } from './song.service';

@Controller('api/manager/songs')
export class AlbumController {
  constructor(private readonly songService: SongService) {}

  @Get()
  public async findAll(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<Song[]> {
    return await this.songService.findAll(artistId);
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

  @Patch(':songId/approve')
  public async approve(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Success> {
    return await this.songService.approve(songId);
  }

  @Patch(':songId/decline')
  public async decline(
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<Success> {
    return await this.songService.decline(songId);
  }

  @Patch(':songId/explicit')
  public async updateExplicit(
    @Param('songId', ParseIntPipe) songId: number,
    @Body('explicit', ParseBoolPipe) explicit: boolean,
  ): Promise<Success> {
    return await this.songService.updateExplicit(songId, explicit);
  }
}
