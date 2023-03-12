import type { IShortArtist } from '@interfaces/artist';
import type { Album } from '@prisma/client';

export type IAlbum = Omit<Album, 'artistId'> & IShortArtist;
