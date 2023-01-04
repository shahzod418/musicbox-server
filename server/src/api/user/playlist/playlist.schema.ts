import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma } from '@prisma/client';

export class PlaylistCreateInput
  implements Pick<Prisma.PlaylistCreateInput, 'name'>
{
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsInt()
  userId: number;
}

export class PlaylistUpdateInput
  implements Pick<Prisma.PlaylistUpdateInput, 'name'>
{
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name: string;
}
