import type { Album, Artist, Song } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId'>;

export type IAlbum = Omit<Album, 'artistId'>;

export type ISong = Omit<Song, 'albumId' | 'artistId'>;
