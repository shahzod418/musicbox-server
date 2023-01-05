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

  @Get(':artistId')
  public async findOne(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<Artist> {
    return await this.artistService.findOne(artistId);
  }

  @Get(':artistId/avatar')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getAvatar(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getAvatar(artistId);

    return new StreamableFile(file);
  }

  @Get(':artistId/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getCover(artistId);

    return new StreamableFile(file);
  }

  @Patch(':artistId/approve')
  public async approve(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<Success> {
    return await this.artistService.approve(artistId);
  }

  @Patch(':artistId/decline')
  public async decline(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<Success> {
    return await this.artistService.decline(artistId);
  }
}
