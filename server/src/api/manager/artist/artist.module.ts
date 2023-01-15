import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ManagerArtistController } from './artist.controller';
import { ManagerArtistService } from './artist.service';

@Module({
  controllers: [ManagerArtistController],
  providers: [ManagerArtistService],
  imports: [PrismaModule],
})
export class ManagerArtistModule {}
