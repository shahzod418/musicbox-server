import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { UserArtistController } from './artist.controller';
import { UserArtistService } from './artist.service';

@Module({
  controllers: [UserArtistController],
  providers: [UserArtistService],
  imports: [PrismaModule, ServicesModule],
})
export class UserArtistModule {}
