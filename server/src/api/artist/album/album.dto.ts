import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { ICreateAlbum, IUpdateAlbum } from './album.interface';

export class CreateAlbumDto implements ICreateAlbum {
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  name: string;

  @IsInt()
  artistId: number;
}

export class UpdateAlbumDto implements IUpdateAlbum {
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  name?: string;
}
