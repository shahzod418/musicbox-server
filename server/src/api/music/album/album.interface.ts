import type { Album, Song } from '@prisma/client';

type ISong = Song;

export type IAlbum = Album;

export type IAlbumWithSongs = IAlbum & { songs: ISong[] };
