import { ApiModule } from '@api/api.module';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

@Module({
  imports: [ApiModule, PrismaModule, ServicesModule],
})
export class AppModule {}
