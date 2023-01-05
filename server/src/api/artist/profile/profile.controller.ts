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
} from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('api/artist/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
    return await this.profileService.create(data, {
      avatar: files?.avatar?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Get(':artistId')
  public async findOne(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Artist> {
    return await this.profileService.findOne(artistId, userId);
  }

  @Patch(':artistId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() data: ArtistUpdateInput,
    @UploadedFiles() files: ArtistFiles,
  ): Promise<Artist> {
    return await this.profileService.update(artistId, data, {
      avatar: files?.avatar?.at(0),
      cover: files?.cover?.at(0),
    });
  }

  @Delete(':artistId')
  public async remove(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<Success> {
    return await this.profileService.remove(artistId);
  }

  @Get(':artistId/avatar')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getAvatar(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    const file = await this.profileService.getAvatar(artistId, userId);

    return new StreamableFile(file);
  }

  @Get(':artistId/cover')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Header('Content-Type', 'image/jpeg')
  public async getCover(
    @Param('artistId', ParseIntPipe) artistId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    const file = await this.profileService.getCover(artistId, userId);

    return new StreamableFile(file);
  }
}
