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

import type { Success } from '@interfaces/response';
import type { Artist } from '@prisma/client';

import { ArtistService } from './artist.service';

@Controller('api/manager/artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  public async findAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Artist> {
    return await this.artistService.findOne(id);
  }

  @Get(':id/avatar')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getAvatar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getAvatar(id);

    return new StreamableFile(file);
  }

  @Get(':id/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getCover(id);

    return new StreamableFile(file);
  }

  @Patch(':id/approve')
  public async approve(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.artistService.approve(id);
  }

  @Patch(':id/decline')
  public async decline(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Success> {
    return await this.artistService.decline(id);
  }
}
