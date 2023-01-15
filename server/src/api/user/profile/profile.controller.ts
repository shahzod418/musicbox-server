import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PrismaClientError } from '@errors/prisma';

import type { IUser } from './profile.interface';

import { UpdateUserDto } from './profile.dto';
import { UserProfileService } from './profile.service';

@Controller('api/user/profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  public async findOne(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<IUser> {
    try {
      return this.userProfileService.findOne(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  public async update(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() data: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<IUser> {
    try {
      return await this.userProfileService.update(userId, data, avatar);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
