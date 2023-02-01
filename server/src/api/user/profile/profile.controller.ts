import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { PrismaClientError } from '@errors/prisma';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ParseAvatarPipe } from '@pipes/parse-avatar';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IUser } from './profile.interface';
import type { IFile } from '@interfaces/file';
import type { ISuccess } from '@interfaces/response';

import { IUpdateUser } from './profile.interface';

import { UserProfileService } from './profile.service';
import { updateUserSchema } from './profile.validation';

@UseGuards(JwtAuthGuard)
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  public async update(
    @Query('userId', ParseIntPipe) userId: number,
    @Body(new ValidationBodyPipe(updateUserSchema)) data: IUpdateUser,
    @UploadedFiles(new ParseAvatarPipe({ optional: true }))
    files: { avatar?: IFile },
  ): Promise<IUser> {
    try {
      return await this.userProfileService.update(userId, data, files.avatar);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }

  @Delete('avatar')
  public async removeAvatar(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ISuccess> {
    try {
      return await this.userProfileService.removeAvatar(userId);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      throw error;
    }
  }
}
