import type { IShortArtist } from '@interfaces/artist';
import type { Playlist, Prisma, Song } from '@prisma/client';

export type IPlaylist = Omit<Playlist, 'userId'>;

export type ISong = Omit<Song, 'artistId'> & IShortArtist;

export type ICreatePlaylistBody = Pick<Prisma.PlaylistCreateInput, 'name'>;

export type ICreatePlaylist = ICreatePlaylistBody & { userId: number };

export type IUpdatePlaylist = Pick<Prisma.PlaylistUpdateInput, 'name'>;
