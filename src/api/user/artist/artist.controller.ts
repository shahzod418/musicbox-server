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

import type { IArtist } from './artist.interface';
import type { ISuccess } from '@interfaces/response';

import { UserArtistService } from './artist.service';

@UseGuards(JwtAuthGuard)
@Controller('api/user/artists')
export class UserArtistController {
  constructor(private readonly userArtistService: UserArtistService) {}

  @Get()
  public async findAll(
    @UserId() userId: number,
    @UserRole() role: Role,
  ): Promise<IArtist[]> {
    try {
      return await this.userArtistService.findAll(userId, role);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Put()
  public async addArtist(
    @UserId() userId: number,
    @UserRole() role: Role,
    @Body('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      await this.userArtistService.accessArtist(userId, artistId, role);

      return await this.userArtistService.addArtist(userId, artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        if (error.meta?.target) {
          throw new BadRequestException('Artist already added');
        }
        throw new BadRequestException('Artist not found');
      }

      throw error;
    }
  }

  @Delete()
  public async removeArtist(
    @UserId() userId: number,
    @UserRole() role: Role,
    @Body('artistId', ParseIntPipe) artistId: number,
  ): Promise<ISuccess> {
    try {
      await this.userArtistService.accessArtist(userId, artistId, role);

      return await this.userArtistService.removeArtist(userId, artistId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
