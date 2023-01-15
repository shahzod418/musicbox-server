import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import type { IUpdateUser } from './profile.interface';

export class UpdateUserDto implements IUpdateUser {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;
}
