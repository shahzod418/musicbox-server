import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';

import type { Success } from '@interfaces/response';
import type { Song } from '@prisma/client';

import { SongService } from './song.service';

@Controller('api/admin/songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  public async findAll(): Promise<Song[]> {
    return await this.songService.findAll();
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<Success> {
    return await this.songService.remove(id);
  }
}
