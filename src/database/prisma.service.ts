import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type { INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      errorFormat: 'minimal',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit', () => {
      void app.close();
    });
  }
}
