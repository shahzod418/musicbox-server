import type { IFile } from '@interfaces/file';
import type { Artist, Prisma, Song } from '@prisma/client';

export type ISong = Omit<Song, 'albumId' | 'artistId' | 'audio'> & {
  artist: Pick<Artist, 'id' | 'name'>;
};

export type ICreateSong = Pick<
  Prisma.SongCreateInput,
  'name' | 'text' | 'explicit' | 'status'
> & { artistId: number; albumId?: number };

export type IUpdateSong = Pick<
  Prisma.SongUpdateInput,
  'name' | 'text' | 'explicit' | 'status'
> & { albumId?: number };

export type ICreateSongFiles = {
  audio: IFile;
  cover?: IFile;
};

export type IUpdateSongFiles = {
  audio?: IFile;
  cover?: IFile;
};
