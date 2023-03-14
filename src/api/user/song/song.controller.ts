import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

import type { ISong } from './song.interface';
import type { ISuccess } from '@interfaces/response';

import { UserSongService } from './song.service';

@UseGuards(JwtAuthGuard)
@Controller('api/user/songs')
export class UserSongController {
  constructor(private readonly userSongService: UserSongService) {}

  @Get()
  public async findAll(
    @UserId() userId: number,
    @UserRole() role: Role,
  ): Promise<ISong[]> {
    try {
      return await this.userSongService.findAll(userId, role);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Put()
  public async addSong(
    @UserId() userId: number,
    @UserRole() role: Role,
    @Body('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.userSongService.accessSong(userId, songId, role);

      return await this.userSongService.addSong(userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        if (error.meta?.target) {
          throw new BadRequestException('Song already added');
        }
        throw new BadRequestException('Song not found');
      }

      throw error;
    }
  }

  @Delete()
  public async removeSong(
    @UserId() userId: number,
    @UserRole() role: Role,
    @Body('songId', ParseIntPipe) songId: number,
  ): Promise<ISuccess> {
    try {
      await this.userSongService.accessSong(userId, songId, role);

      return await this.userSongService.removeSong(userId, songId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
