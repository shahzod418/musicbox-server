import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { MusicArtistController } from './artist.controller';
import { MusicArtistService } from './artist.service';

@Module({
  controllers: [MusicArtistController],
  providers: [MusicArtistService],
  imports: [PrismaModule],
})
export class MusicArtistModule {}
