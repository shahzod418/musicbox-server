import type { IFile } from '@interfaces/file';
import type { Prisma, Song } from '@prisma/client';

export type ISong = Omit<Song, 'artistId' | 'albumId' | 'audio'>;

export type ICreateSongBody = Pick<Prisma.SongCreateInput, 'name' | 'text'> & {
  albumId?: number;
};

export type ICreateSong = ICreateSongBody & { artistId: number };

export type IUpdateSong = Pick<Prisma.SongUpdateInput, 'name' | 'text'> & {
  albumId?: number;
};

export type ICreateSongFiles = {
  audio: IFile;
  cover?: IFile;
};

export type IUpdateSongFiles = {
  audio?: IFile;
  cover?: IFile;
};
