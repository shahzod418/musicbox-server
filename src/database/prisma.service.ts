import { Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

import type { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      errorFormat: 'minimal',
    });
  }

  // TODO: Very bad practice!!!
  async onModuleInit(): Promise<void> {
    await this.$connect();

    // Add console command or data for seeding

    // await this.user.upsert({
    //   data: {
    //     email: 'admin@musicbox.com',
    //     hash: '$2b$10$HiwZ/mSy5MclVeic/Hqbe.xBoosypUXFT2V1MLDiNIgDo5s7rKZha',
    //     role: Role.ADMIN,
    //   },
    // });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async enableShutdownHooks(app: INestApplication): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
