import { Module } from '@nestjs/common';

import { AlbumController } from './song.controller';
import { SongService } from './song.service';

@Module({
  controllers: [AlbumController],
  providers: [SongService],
})
export class SongModule {}
