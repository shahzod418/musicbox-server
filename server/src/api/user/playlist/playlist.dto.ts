import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import type { ICreatePlaylist, IUpdatePlaylist } from './playlist.interface';

export class CreatePlaylistDto implements ICreatePlaylist {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsInt()
  userId: number;
}

export class UpdatePlaylistDto implements IUpdatePlaylist {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  name?: string;
}
