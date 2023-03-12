import type { IFile } from '@interfaces/file';
import type { Album, Artist, Prisma } from '@prisma/client';

export type IAlbum = Omit<Album, 'artistId'> & {
  artist: Pick<Artist, 'id' | 'name'>;
};

export type ICreateAlbum = Pick<Prisma.AlbumCreateInput, 'name' | 'status'> & {
  artistId: number;
};

export type IUpdateAlbum = Pick<Prisma.AlbumUpdateInput, 'name' | 'status'>;

export type IAlbumFiles = {
  cover?: IFile;
};
