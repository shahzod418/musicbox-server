import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';

import { NotFoundError } from '@errors/not-found';
import { PrismaClientError } from '@errors/prisma';

import { ContentAvatarService } from './avatar.service';

@Controller('api/content')
export class ContentAvatarController {
  constructor(private readonly contentAvatarService: ContentAvatarService) {}

  @Get('users/:userId/avatar')
  @Header('Content-Type', 'image/jpeg')
  public async getUserAvatar(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentAvatarService.getUserAvatar(userId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get('artists/:artistId/avatar')
  @Header('Content-Type', 'image/jpeg')
  public async getArtistAvatar(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.contentAvatarService.getArtistAvatar(artistId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
