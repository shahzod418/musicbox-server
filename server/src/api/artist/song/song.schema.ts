import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { Prisma } from '@prisma/client';

export class ISongCreateFiles {
  audio: Express.Multer.File[];

  @IsOptional()
  cover?: Express.Multer.File[];
}

export class ISongUpdateFiles {
  @IsOptional()
  audio?: Express.Multer.File[];

  @IsOptional()
  cover?: Express.Multer.File[];
}

export class ISongCreateInput
  implements Pick<Prisma.SongCreateInput, 'name' | 'text'>
{
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsInt()
  artistId: number;

  @IsInt()
  @IsOptional()
  albumId?: number;
}

export class ISongUpdateInput
  implements Pick<Prisma.SongUpdateInput, 'name' | 'text'>
{
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsInt()
  @IsOptional()
  albumId?: number;
}
