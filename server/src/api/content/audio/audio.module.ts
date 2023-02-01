import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ContentAudioController } from './audio.controller';
import { ContentAudioService } from './audio.service';

@Module({
  controllers: [ContentAudioController],
  providers: [ContentAudioService],
  imports: [PrismaModule, ServicesModule],
})
export class ContentAudioModule {}
