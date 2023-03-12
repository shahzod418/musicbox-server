import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ContentArtistController } from './artist.controller';
import { ContentArtistService } from './artist.service';

@Module({
  controllers: [ContentArtistController],
  providers: [ContentArtistService],
  imports: [PrismaModule],
})
export class ContentArtistModule {}
