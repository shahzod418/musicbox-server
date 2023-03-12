import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ArtistAlbumController } from './album.controller';
import { ArtistAlbumService } from './album.service';

@Module({
  controllers: [ArtistAlbumController],
  providers: [ArtistAlbumService],
  imports: [PrismaModule, ServicesModule],
})
export class ArtistAlbumModule {}
