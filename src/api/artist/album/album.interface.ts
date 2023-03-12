import type { Album, Prisma, Song } from '@prisma/client';

export type IAlbum = Omit<Album, 'artistId'>;

export type ISong = Pick<Song, 'id' | 'name'>;

export type ICreateAlbum = Pick<Prisma.AlbumCreateInput, 'name'> & {
  artistId: number;
};

export type IUpdateAlbum = Pick<Prisma.AlbumUpdateInput, 'name'>;
