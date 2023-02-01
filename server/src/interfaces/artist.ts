import type { Artist } from '@prisma/client';

export type IShortArtist = { artist: Pick<Artist, 'id' | 'name'> };
