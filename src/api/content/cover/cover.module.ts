import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ContentCoverController } from './cover.controller';
import { ContentCoverService } from './cover.service';

@Module({
  controllers: [ContentCoverController],
  providers: [ContentCoverService],
  imports: [PrismaModule, ServicesModule],
})
export class ContentCoverModule {}
