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
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IUser } from './user.interface';
import type { ISuccess } from '@interfaces/response';

import { ICreateUser, IUpdateUser, IUserFiles } from './user.interface';

import { AdminUserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.validation';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard)
@Controller('api/admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  public async create(
    @Body(new ValidationBodyPipe<ICreateUser>(createUserSchema))
    data: ICreateUser,
    @UploadedFiles(new ParseAvatarPipe({ optional: true }))
    files: IUserFiles,
  ): Promise<IUser> {
    try {
      return await this.adminUserService.create(data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException('User already exist');
      }

      if (error instanceof FileNotRecordError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Get()
  public async findAll(): Promise<IUser[]> {
    try {
      return await this.adminUserService.findAll();
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Patch(':userId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  public async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationBodyPipe<IUpdateUser>(updateUserSchema))
    data: IUpdateUser,
    @UploadedFiles(new ParseAvatarPipe({ optional: true }))
    files: IUserFiles,
  ): Promise<IUser> {
    try {
      return await this.adminUserService.update(userId, data, files);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof FileNotUpdatedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw error;
    }
  }

  @Delete(':userId')
  public async remove(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminUserService.remove(userId);
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

  @Delete(':userId/avatar')
  public async removeAvatar(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ISuccess> {
    try {
      return await this.adminUserService.removeAvatar(userId);
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
