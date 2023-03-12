import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { UserPlaylistController } from './playlist.controller';
import { UserPlaylistService } from './playlist.service';

@Module({
  controllers: [UserPlaylistController],
  providers: [UserPlaylistService],
  imports: [PrismaModule, ServicesModule],
})
export class UserPlaylistModule {}
