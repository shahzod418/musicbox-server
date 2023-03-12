import { Status } from '@prisma/client';

import type { Prisma, Role } from '@prisma/client';

export const getContentWhere = (
  role?: Role,
  userId?: number,
): Prisma.SongWhereInput | Prisma.AlbumWhereInput => {
  switch (role) {
    case 'Admin':
      return {};
    case 'Manager':
      return { status: Status.Review };
    case 'Artist':
      return {
        OR: [
          { status: Status.Approved },
          { status: Status.Deleted },
          { artist: { userId } },
        ],
      };
    case 'User':
    default:
      return {
        OR: [{ status: Status.Approved }, { status: Status.Deleted }],
      };
  }
};

export const getArtistContentWhere = (
  role?: Role,
  userId?: number,
): Prisma.ArtistWhereInput => {
  switch (role) {
    case 'Admin':
      return {};
    case 'Manager':
      return { status: Status.Review };
    case 'Artist':
      return {
        OR: [
          { status: Status.Approved },
          { status: Status.Deleted },
          { userId },
        ],
      };
    case 'User':
    default:
      return {
        OR: [{ status: Status.Approved }, { status: Status.Deleted }],
      };
  }
};
