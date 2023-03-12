import { SetMetadata } from '@nestjs/common';

import type { CustomDecorator } from '@nestjs/common';
import type { Role } from '@prisma/client';

export const Roles = (...roles: Role[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
