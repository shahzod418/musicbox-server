import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { ServicesModule } from '@services/services.module';

import { AdminUserController } from './user.controller';
import { AdminUserService } from './user.service';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  imports: [PrismaModule, ServicesModule],
})
export class AdminUserModule {}
