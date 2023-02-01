import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { ContentAlbumController } from './album.controller';
import { ContentAlbumService } from './album.service';

@Module({
  controllers: [ContentAlbumController],
  providers: [ContentAlbumService],
  imports: [PrismaModule],
})
export class ContentAlbumModule {}
