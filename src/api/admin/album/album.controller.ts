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
} from '@errors/file';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ParseCoverPipe } from '@pipes/parse-cover';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IAlbum } from './album.interface';
import type { ISuccess } from '@interfaces/response';

import { IAlbumFiles, ICreateAlbum, IUpdateAlbum } from './album.interface';

import { AdminAlbumService } from './album.service';
import { createAlbumSchema, updateAlbumSchema } from './album.validation';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard)
@Controller('api/admin/albums')
export class AdminAlbumController {
  constructor(private readonly adminAlbumService: AdminAlbumService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async create(
    @Body(new ValidationBodyPipe<ICreateAlbum>(createAlbumSchema))
    data: ICreateAlbum,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: IAlbumFiles,
  ): Promise<IAlbum> {
    try {
      return await this.adminAlbumService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof FileNotRecordError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Get(':albumId')
  public async findOne(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<IAlbum> {
    try {
      return await this.adminAlbumService.findOne(albumId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':albumId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }]))
  public async update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Body(new ValidationBodyPipe<IUpdateAlbum>(updateAlbumSchema))
    data: IUpdateAlbum,
    @UploadedFiles(new ParseCoverPipe({ optional: true }))
    files: IAlbumFiles,
  ): Promise<IAlbum> {
    try {
      return await this.adminAlbumService.update(albumId, data, files);
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

  @Delete(':albumId')
  public async remove(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminAlbumService.remove(albumId);
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

  @Delete(':albumId/cover')
  public async removeCover(
    @Param('albumId', ParseIntPipe) albumId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminAlbumService.removeCover(albumId);
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
