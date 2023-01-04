import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma } from '@prisma/client';

export class UserCreateInput
  implements Pick<Prisma.UserCreateInput, 'email' | 'name'>
{
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
