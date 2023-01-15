import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { MusicAlbumController } from './album.controller';
import { MusicAlbumService } from './album.service';

@Module({
  controllers: [MusicAlbumController],
  providers: [MusicAlbumService],
  imports: [PrismaModule],
})
export class MusicAlbumModule {}
