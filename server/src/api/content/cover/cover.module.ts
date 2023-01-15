import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';

@Module({
  controllers: [CoverController],
  providers: [CoverService],
  imports: [PrismaModule, ServicesModule],
})
export class CoverModule {}
