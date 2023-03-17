import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { UserAlbumController } from './album.controller';
import { UserAlbumService } from './album.service';

@Module({
  controllers: [UserAlbumController],
  providers: [UserAlbumService],
  imports: [PrismaModule, ServicesModule],
})
export class UserAlbumModule {}
