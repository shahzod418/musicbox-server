import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ArtistSongController } from './song.controller';
import { ArtistSongService } from './song.service';

@Module({
  controllers: [ArtistSongController],
  providers: [ArtistSongService],
  imports: [PrismaModule, ServicesModule],
})
export class ArtistSongModule {}
