import type { IShortArtist } from '@interfaces/artist';
import type { Playlist, Prisma, Song } from '@prisma/client';

export type IPlaylist = Omit<Playlist, 'userId'>;

export type ISong = Omit<Song, 'artistId'> & IShortArtist;

export type ICreatePlaylist = Pick<Prisma.PlaylistCreateInput, 'name'> & {
  userId: number;
};

export type IUpdatePlaylist = Pick<Prisma.PlaylistUpdateInput, 'name'>;
