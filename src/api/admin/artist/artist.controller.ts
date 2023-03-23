import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Roles } from '@decorators/roles.decorator';
import {
  FileNotRecordError,
  FileNotRemovedError,
  FileNotUpdatedError,
  ResourcesNotRemovedError,
} from '@errors/file';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ParseAvatarPipe } from '@pipes/parse-avatar';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IAlbum, IArtist, ISong } from './artist.interface';
import type { IShortArtist } from '@interfaces/artist';
import type { ISuccess } from '@interfaces/response';

import { IArtistFiles, ICreateArtist, IUpdateArtist } from './artist.interface';

import { AdminArtistService } from './artist.service';
import { createArtistSchema, updateArtistSchema } from './artist.validation';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard)
@Controller('api/admin/artists')
export class AdminArtistController {
  constructor(private readonly adminArtistService: AdminArtistService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  public async create(
    @Body(new ValidationBodyPipe<ICreateArtist>(createArtistSchema))
    data: ICreateArtist,
    @UploadedFiles(
      new ParseAvatarPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IArtistFiles,
  ): Promise<IArtist> {
    try {
      return await this.adminArtistService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException('Artist not created');
      }

      if (error instanceof FileNotRecordError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Get()
  public async findAll(): Promise<IArtist[]> {
    try {
      return await this.adminArtistService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId')
  public async findOne(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<IArtist> {
    try {
      return await this.adminArtistService.findOne(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/albums')
  public async findAllAlbum(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<IAlbum[]> {
    try {
      return await this.adminArtistService.findAllAlbum(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/albums/:albumId')
  public async findOneAlbum(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbum & IShortArtist & { songs: ISong[] }> {
    try {
      return await this.adminArtistService.findOneAlbum(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':artistId/songs')
  public async findAllSong(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISong[]> {
    try {
      return await this.adminArtistService.findAllSong(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
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
    @Body(new ValidationBodyPipe<IUpdateArtist>(updateArtistSchema))
    data: IUpdateArtist,
    @UploadedFiles(
      new ParseAvatarPipe({ optional: true }),
      new ParseCoverPipe({ optional: true }),
    )
    files: IArtistFiles,
  ): Promise<IArtist> {
    try {
      return await this.adminArtistService.update(artistId, data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof FileNotUpdatedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Delete(':artistId')
  public async remove(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminArtistService.remove(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof ResourcesNotRemovedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Delete(':artistId/avatar')
  public async removeAvatar(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminArtistService.removeAvatar(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotRemovedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Delete(':artistId/cover')
  public async removeCover(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminArtistService.removeCover(artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotRemovedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }
}
