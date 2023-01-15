import type { Playlist, Prisma } from '@prisma/client';

export type IPlaylist = Omit<Playlist, 'userId'>;

export type ICreatePlaylist = Pick<Prisma.PlaylistCreateInput, 'name'> & {
  userId: number;
};

export type IUpdatePlaylist = Pick<Prisma.PlaylistUpdateInput, 'name'>;
