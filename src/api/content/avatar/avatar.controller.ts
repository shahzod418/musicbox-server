import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { UserId, UserRole } from '@decorators/users.decorator';
import { NotFoundError } from '@errors/not-found';
import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@guards/optional-jwt-auth.guard';

import { ContentAvatarService } from './avatar.service';

@Controller('api/content')
export class ContentAvatarController {
  constructor(private readonly contentAvatarService: ContentAvatarService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/avatar')
  @Header('Content-Type', 'image/jpeg')
  public async getUserAvatar(
    @UserId() userId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentAvatarService.getUserAvatar(userId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('artists/:artistId/avatar')
  @Header('Content-Type', 'image/jpeg')
  public async getArtistAvatar(
    @Param('artistId', ParseIntPipe) artistId: number,
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentAvatarService.getArtistAvatar(
        artistId,
        role,
        userId,
      );

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
