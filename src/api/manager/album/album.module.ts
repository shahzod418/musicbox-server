import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ManagerAlbumController } from './album.controller';
import { ManagerAlbumService } from './album.service';

@Module({
  controllers: [ManagerAlbumController],
  providers: [ManagerAlbumService],
  imports: [PrismaModule],
})
export class ManagerAlbumModule {}
