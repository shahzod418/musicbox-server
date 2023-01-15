import type { Album, Artist, Song } from '@prisma/client';

type ISong = Song;
type IAlbum = Album;

export type IArtist = Omit<Artist, 'userId'>;

export type IArtistWithAlbumsAndSongs = IArtist & {
  songs: ISong[];
  albums: IAlbum[];
};
