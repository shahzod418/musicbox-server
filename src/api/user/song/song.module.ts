import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { UserSongController } from './song.controller';
import { UserSongService } from './song.service';

@Module({
  controllers: [UserSongController],
  providers: [UserSongService],
  imports: [PrismaModule, ServicesModule],
})
export class UserSongModule {}
