import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { UserArtistController } from './artist.controller';
import { UserArtistService } from './artist.service';

@Module({
  controllers: [UserArtistController],
  providers: [UserArtistService],
  imports: [PrismaModule],
})
export class UserArtistModule {}
