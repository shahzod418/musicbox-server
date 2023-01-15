import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { MusicSongController } from './song.controller';
import { MusicSongService } from './song.service';

@Module({
  controllers: [MusicSongController],
  providers: [MusicSongService],
  imports: [PrismaModule],
})
export class MusicSongModule {}
