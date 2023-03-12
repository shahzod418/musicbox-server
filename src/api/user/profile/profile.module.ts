import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { UserProfileController } from './profile.controller';
import { UserProfileService } from './profile.service';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService],
  imports: [PrismaModule, ServicesModule],
})
export class UserProfileModule {}
