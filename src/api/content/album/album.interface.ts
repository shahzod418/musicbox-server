import type { IShortArtist } from '@interfaces/artist';
import type { Album, Song } from '@prisma/client';

export type ISong = Omit<Song, 'artistId' | 'albumId'>;

export type IAlbum = Omit<Album, 'artistId'> & IShortArtist;
