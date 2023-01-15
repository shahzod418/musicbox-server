import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';

import { PrismaClientError } from '@errors/prisma';

import { AvatarService } from './avatar.service';

@Controller('api')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get('users/:userId/avatar')
  @Header('Content-Type', 'image/jpeg')
  public async getUserAvatar(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<StreamableFile> {
    try {
      const file = await this.avatarService.getUserAvatar(userId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
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
      const file = await this.avatarService.getArtistAvatar(artistId);

      return new StreamableFile(file);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
