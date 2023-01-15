import type { Prisma, Song } from '@prisma/client';

export type ISong = Omit<Song, 'artistId' | 'albumId'>;

export type ICreateSong = Pick<Prisma.SongCreateInput, 'name' | 'text'> & {
  artistId: number;
  albumId?: number;
};

export type IUpdateSong = Pick<Prisma.SongUpdateInput, 'name' | 'text'> & {
  albumId?: number;
};

export type ICreateSongFiles = {
  audio: Express.Multer.File;
  cover?: Express.Multer.File;
};

export type IUpdateSongFiles = {
  audio?: Express.Multer.File;
  cover?: Express.Multer.File;
};
