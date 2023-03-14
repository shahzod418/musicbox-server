import type { IFile } from '@interfaces/file';
import type { Artist, Prisma } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId'>;

export type ICreateArtistBody = Pick<
  Prisma.ArtistCreateInput,
  'name' | 'description'
>;

export type ICreateArtist = ICreateArtistBody & { userId: number };

export type IUpdateArtist = Pick<
  Prisma.ArtistUpdateInput,
  'name' | 'description'
>;

export type IArtistFiles = {
  avatar?: IFile;
  cover?: IFile;
};
