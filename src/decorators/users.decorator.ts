import { createParamDecorator } from '@nestjs/common';

import type { IUserRequest } from '@interfaces/user';
import type { ExecutionContext } from '@nestjs/common';

// TODO: What if they don't return?

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<IUserRequest>();

  return request.user.id;
});

export const UserRole = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<IUserRequest>();

  return request.user.role;
});
