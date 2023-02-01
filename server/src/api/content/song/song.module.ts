import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ContentSongController } from './song.controller';
import { ContentSongService } from './song.service';

@Module({
  controllers: [ContentSongController],
  providers: [ContentSongService],
  imports: [PrismaModule],
})
export class ContentSongModule {}
