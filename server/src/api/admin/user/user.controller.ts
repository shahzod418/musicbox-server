import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaClientError } from '@errors/prisma';

import type { IUser } from './user.interface';
import type { ISuccess } from '@interfaces/response';

import { AdminUserService } from './user.service';

@Controller('api/admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

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

  @Patch(':userId/:role')
  public async updateRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<ISuccess> {
    try {
      return await this.adminUserService.updateRole(userId, role);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
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

      throw error;
    }
  }
}
