import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  StreamableFile,
} from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

import { ISongUpdateExplicitInput } from './song.schema';
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

  @Patch(':id/approve')
  public async approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.songService.approve(id);
  }

  @Patch(':id/decline')
  public async decline(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.songService.decline(id);
  }

  @Patch(':id/explicit')
  public async updateExplicit(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ISongUpdateExplicitInput,
  ): Promise<Success> {
    return await this.songService.updateExplicit(id, data.explicit);
  }
}
