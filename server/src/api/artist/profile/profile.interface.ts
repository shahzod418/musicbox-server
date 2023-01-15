import type { Artist, Prisma } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId'>;

export type ICreateArtist = Pick<
  Prisma.ArtistCreateInput,
  'name' | 'description'
> & {
  userId: number;
};

export type IUpdateArtist = Pick<
  Prisma.ArtistUpdateInput,
  'name' | 'description'
>;

export type IArtistFiles = {
  avatar?: Express.Multer.File;
  cover?: Express.Multer.File;
};
