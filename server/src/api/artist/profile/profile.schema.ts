import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma } from '@prisma/client';

export class ArtistFiles {
  @IsOptional()
  avatar?: Express.Multer.File[];

  @IsOptional()
  cover?: Express.Multer.File[];
}

export class ArtistCreateInput
  implements Pick<Prisma.ArtistCreateInput, 'name' | 'description'>
{
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  userId: number;
}

export class ArtistUpdateInput
  implements Pick<Prisma.ArtistUpdateInput, 'name' | 'description'>
{
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
