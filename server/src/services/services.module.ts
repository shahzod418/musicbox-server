import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { FileService } from './file/file.service';
import { UserService } from './user/user.service';

@Module({
  providers: [FileService, UserService],
  exports: [FileService, UserService],
  imports: [PrismaModule],
})
export class ServicesModule {}
