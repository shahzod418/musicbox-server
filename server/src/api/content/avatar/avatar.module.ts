import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ContentAvatarController } from './avatar.controller';
import { ContentAvatarService } from './avatar.service';

@Module({
  controllers: [ContentAvatarController],
  providers: [ContentAvatarService],
  imports: [PrismaModule, ServicesModule],
})
export class ContentAvatarModule {}
