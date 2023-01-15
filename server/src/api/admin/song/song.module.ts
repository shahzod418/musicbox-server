import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { AdminSongController } from './song.controller';
import { AdminSongService } from './song.service';

@Module({
  controllers: [AdminSongController],
  providers: [AdminSongService],
  imports: [PrismaModule, ServicesModule],
})
export class AdminSongModule {}
