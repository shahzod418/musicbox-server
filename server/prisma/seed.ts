import { PrismaClient, Role, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: '1@musicbox.test',
      hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: '2@musicbox.test',
      hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      email: 'admin@musicbox.test',
      role: Role.ADMIN,
      hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      email: 'artist@musicbox.test',
      role: Role.ARTIST,
      hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    },
  });

  const user5 = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
      email: 'manager@musicbox.test',
      role: Role.MANAGER,
      hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    },
  });

  const artist1 = await prisma.artist.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test artist',
      status: Status.APPROVED,
      user: {
        connect: { id: 4 },
      },
      users: {
        connectOrCreate: {
          where: {
            userId_artistId: {
              userId: 1,
              artistId: 1,
            },
          },
          create: {
            user: {
              connect: {
                id: 1,
              },
            },
          },
        },
      },
    },
  });

  const album1 = await prisma.album.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test album 1',
      status: Status.APPROVED,
      artist: {
        connect: { id: 1 },
      },
      users: {
        connectOrCreate: {
          where: {
            userId_albumId: {
              userId: 1,
              albumId: 1,
            },
          },
          create: {
            user: {
              connect: { id: 1 },
            },
          },
        },
      },
    },
  });

  const song1 = await prisma.song.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test song 1',
      audio: 'test1.mp3',
      status: Status.APPROVED,
      artist: {
        connect: { id: 1 },
      },
      album: {
        connect: { id: 1 },
      },
      users: {
        connectOrCreate: {
          where: {
            userId_songId: {
              userId: 1,
              songId: 1,
            },
          },
          create: {
            user: {
              connect: { id: 1 },
            },
          },
        },
      },
    },
  });

  const song2 = await prisma.song.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Test song 2',
      audio: 'test2.mp3',
      status: Status.APPROVED,
      artist: {
        connect: { id: 1 },
      },
      users: {
        connectOrCreate: {
          where: {
            userId_songId: {
              userId: 1,
              songId: 2,
            },
          },
          create: {
            user: {
              connect: { id: 1 },
            },
          },
        },
      },
    },
  });

  const song3 = await prisma.song.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Test song 3',
      audio: 'test3.mp3',
      explicit: true,
      artist: {
        connect: { id: 1 },
      },
      album: {
        connect: { id: 1 },
      },
      users: {
        connectOrCreate: {
          where: {
            userId_songId: {
              userId: 2,
              songId: 3,
            },
          },
          create: {
            user: {
              connect: { id: 2 },
            },
          },
        },
      },
    },
  });

  const song4 = await prisma.song.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Test song 4',
      audio: 'test4.mp3',
      explicit: true,
      status: Status.DELETED,
      artist: {
        connect: { id: 1 },
      },
      album: {
        connect: { id: 1 },
      },
    },
  });

  const song5 = await prisma.song.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Test song 5',
      audio: 'test5.mp3',
      explicit: true,
      status: Status.DECLINED,
      artist: {
        connect: { id: 1 },
      },
      album: {
        connect: { id: 1 },
      },
    },
  });

  const playlist1 = await prisma.playlist.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test playlist',
      user: {
        connect: { id: 1 },
      },
      songs: {
        connect: [
          {
            userId_songId: {
              userId: 1,
              songId: 1,
            },
          },
          {
            userId_songId: {
              userId: 1,
              songId: 2,
            },
          },
        ],
      },
    },
  });

  console.info({ user1, user2, user3, user4, user5 });
  console.info({ artist1 });
  console.info({ album1 });
  console.info({ song1, song2, song3, song4, song5 });
  console.info({ playlist1 });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
