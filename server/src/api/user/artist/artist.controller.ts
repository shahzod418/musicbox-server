import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import type { Success } from '@interfaces/response';
import type { Artist } from '@prisma/client';

import {
  ArtistCreateInput,
  ArtistFiles,
  ArtistUpdateInput,
} from './artist.schema';
import { ArtistService } from './artist.service';

@Controller('api/user/artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body() data: ArtistCreateInput,
    @UploadedFiles() files: ArtistFiles,
  ): Promise<Artist> {
    return await this.artistService.create(data, {
      avatar: files?.avatar?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Artist> {
    return await this.artistService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ArtistUpdateInput,
    @UploadedFiles() files: ArtistFiles,
  ): Promise<Artist> {
    return await this.artistService.update(id, data, {
      avatar: files?.avatar?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<Success> {
    return await this.artistService.remove(id);
  }

  @Get(':id/avatar')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getAvatar(id, userId);

    return new StreamableFile(file);
  }

  @Get(':id/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    const file = await this.artistService.getCover(id, userId);

    return new StreamableFile(file);
  }
}
