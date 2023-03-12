import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { ArtistProfileController } from './profile.controller';
import { ArtistProfileService } from './profile.service';

@Module({
  controllers: [ArtistProfileController],
  providers: [ArtistProfileService],
  imports: [PrismaModule, ServicesModule],
})
export class ArtistProfileModule {}
