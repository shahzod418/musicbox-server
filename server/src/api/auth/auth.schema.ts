import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma, User } from '@prisma/client';

export class UserSignUp
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

export class UserSignIn implements Pick<User, 'email'> {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
