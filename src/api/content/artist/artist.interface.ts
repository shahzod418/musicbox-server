import type { Album, Artist, Song } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId'>;

export type IArtistShort = Pick<Artist, 'id' | 'name' | 'avatar' | 'status'>;

export type IAlbum = Omit<Album, 'artistId'>;

export type ISong = Omit<Song, 'albumId' | 'artistId'>;
