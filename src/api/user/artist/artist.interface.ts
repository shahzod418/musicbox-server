import type { Artist } from '@prisma/client';

export type IArtist = Omit<Artist, 'userId' | 'avatar'>;
