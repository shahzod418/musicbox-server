import type { IFile } from '@interfaces/file';
import type { Album, Artist, Prisma, Song } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId'>;

export type IAlbum = Omit<Album, 'artistId'>;

export type ISong = Omit<Song, 'albumId' | 'artistId'>;

export type ICreateArtist = Pick<
  Prisma.ArtistCreateInput,
  'name' | 'description' | 'status'
> & { userId: number };

export type IUpdateArtist = Pick<
  Prisma.ArtistUpdateInput,
  'name' | 'description' | 'status'
>;

export type IArtistFiles = {
  avatar?: IFile;
  cover?: IFile;
};
