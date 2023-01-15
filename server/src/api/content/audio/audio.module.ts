import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

@Module({
  controllers: [AudioController],
  providers: [AudioService],
  imports: [PrismaModule, ServicesModule],
})
export class AudioModule {}
