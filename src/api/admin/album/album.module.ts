import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { AdminAlbumController } from './album.controller';
import { AdminAlbumService } from './album.service';

@Module({
  controllers: [AdminAlbumController],
  providers: [AdminAlbumService],
  imports: [PrismaModule, ServicesModule],
})
export class AdminAlbumModule {}
