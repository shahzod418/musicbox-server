import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { AdminArtistController } from './artist.controller';
import { AdminArtistService } from './artist.service';

@Module({
  controllers: [AdminArtistController],
  providers: [AdminArtistService],
  imports: [PrismaModule, ServicesModule],
})
export class AdminArtistModule {}
