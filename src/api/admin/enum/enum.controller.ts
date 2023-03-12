import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';

import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';

import type { Status } from '@prisma/client';

import { AdminEnumService } from './enum.service';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard)
@Controller('api/admin/enums')
export class AdminEnumController {
  constructor(private readonly adminEnumService: AdminEnumService) {}

  @Get('role')
  public findAllRole(): Role[] {
    return this.adminEnumService.findAllRole();
  }

  @Get('status')
  public findAllStatus(): Status[] {
    return this.adminEnumService.findAllStatus();
  }
}
