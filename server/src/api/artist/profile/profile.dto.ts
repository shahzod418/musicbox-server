import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { ICreateArtist, IUpdateArtist } from './profile.interface';

export class ArtistFilesDto {
  @IsOptional()
  avatar?: Express.Multer.File[];

  @IsOptional()
  cover?: Express.Multer.File[];
}

export class CreateArtistDto implements ICreateArtist {
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

export class UpdateArtistDto implements IUpdateArtist {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
