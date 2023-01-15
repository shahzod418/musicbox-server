import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ManagerAlbumController } from './song.controller';
import { ManagerSongService } from './song.service';

@Module({
  controllers: [ManagerAlbumController],
  providers: [ManagerSongService],
  imports: [PrismaModule],
})
export class ManagerSongModule {}
