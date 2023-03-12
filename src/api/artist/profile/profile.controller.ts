import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Roles } from '@decorators/roles.decorator';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ParseAvatarPipe } from '@pipes/parse-avatar';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IArtist } from './profile.interface';
import type { ISuccess } from '@interfaces/response';

import {
  IArtistFiles,
  ICreateArtist,
  IUpdateArtist,
} from './profile.interface';

import { ArtistProfileService } from './profile.service';
import { createArtistSchema, updateArtistSchema } from './profile.validation';

@UseGuards(RolesGuard)
@Roles(Role.Artist)
@UseGuards(JwtAuthGuard)
@Controller('api/artist/profile')
export class ArtistProfileController {
  constructor(private readonly artistProfileService: ArtistProfileService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body(new ValidationBodyPipe(createArtistSchema)) data: ICreateArtist,
    @UploadedFiles(
      new ParseAvatarPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IArtistFiles,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException('Artist already exist');
      }

      throw error;
    }
  }

  @Get()
  public async findOne(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.findOne(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async update(
    @Query('artistId', ParseIntPipe) artistId: number,
    @Body(new ValidationBodyPipe(updateArtistSchema)) data: IUpdateArtist,
    @UploadedFiles(
      new ParseAvatarPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IArtistFiles,
  ): Promise<IArtist> {
    try {
      return await this.artistProfileService.update(artistId, data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete()
  public async remove(
    @Query('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.artistProfileService.remove(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
