import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma } from '@prisma/client';

export class IAlbumCreateInput
  implements Pick<Prisma.AlbumCreateInput, 'name'>
{
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  name: string;

  @IsInt()
  artistId: number;
}

export class IAlbumUpdateInput
  implements Pick<Prisma.AlbumUpdateInput, 'name'>
{
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  name?: string;
}
