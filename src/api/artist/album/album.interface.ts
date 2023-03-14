import type { Album, Prisma, Song } from '@prisma/client';

export type IAlbum = Omit<Album, 'artistId'>;

export type ISong = Pick<Song, 'id' | 'name'>;

export type ICreateAlbumBody = Pick<Prisma.AlbumCreateInput, 'name'>;

export type ICreateAlbum = ICreateAlbumBody & { artistId: number };

export type IUpdateAlbum = Pick<Prisma.AlbumUpdateInput, 'name'>;
