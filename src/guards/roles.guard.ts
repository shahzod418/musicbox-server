import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { IUserRequest } from '@interfaces/user';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<IUserRequest>();

    return roles.some(role => user.role === role);
  }
}
