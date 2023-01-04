import {
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import type { Success } from '@interfaces/response';
import type { User } from '@prisma/client';

import { UserService } from './user.service';

@Controller('api/admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Patch(':id/:role')
  public async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('role', ParseEnumPipe) role: Role,
  ): Promise<Success> {
    return await this.userService.updateRole(id, role);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<Success> {
    return await this.userService.remove(id);
  }
}
