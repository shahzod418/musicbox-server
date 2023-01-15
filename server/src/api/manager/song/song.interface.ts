import type { Song } from '@prisma/client';

export type ISong = Omit<Song, 'listens'>;
