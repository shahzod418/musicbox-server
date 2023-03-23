import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { IUserRequest } from '@interfaces/user';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T extends IUserRequest>(error: unknown, user: T): T {
    if (error) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
