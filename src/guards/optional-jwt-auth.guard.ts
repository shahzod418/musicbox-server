import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { IUserRequest } from '@interfaces/user';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  handleRequest(error: unknown, user: IUserRequest): IUserRequest {
    if (error) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
