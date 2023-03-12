import type { IShortArtist } from '@interfaces/artist';
import type { Song } from '@prisma/client';

export type ISong = Omit<Song, 'artistId' | 'audio'> & IShortArtist;
