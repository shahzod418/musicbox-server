import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { UserAlbumController } from './album.controller';
import { UserAlbumService } from './album.service';

@Module({
  controllers: [UserAlbumController],
  providers: [UserAlbumService],
  imports: [PrismaModule],
})
export class UserAlbumModule {}
