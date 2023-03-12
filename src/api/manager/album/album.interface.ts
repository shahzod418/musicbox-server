import type { Album, Artist } from '@prisma/client';

export type IAlbum = Omit<Album, 'artistId'> & {
  artist: Pick<Artist, 'id' | 'name'>;
};
