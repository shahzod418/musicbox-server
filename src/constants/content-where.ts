import { Status } from '@prisma/client';

import type { Prisma, Role } from '@prisma/client';

export const getContentWhere = (
  role?: Role,
  userId?: number,
): Prisma.SongWhereInput | Prisma.AlbumWhereInput => {
  switch (role) {
    case 'ADMIN':
      return {};
    case 'MANAGER':
      return { status: Status.REVIEW };
    case 'ARTIST':
      return {
        OR: [
          { status: Status.APPROVED },
          { status: Status.DELETED },
          { artist: { userId } },
        ],
      };
    default:
      return {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      };
  }
};

export const getArtistContentWhere = (
  role?: Role,
  userId?: number,
): Prisma.ArtistWhereInput => {
  switch (role) {
    case 'ADMIN':
      return {};
    case 'MANAGER':
      return { status: Status.REVIEW };
    case 'ARTIST':
      return {
        OR: [
          { status: Status.APPROVED },
          { status: Status.DELETED },
          { userId },
        ],
      };
    default:
      return {
        OR: [{ status: Status.APPROVED }, { status: Status.DELETED }],
      };
  }
};
