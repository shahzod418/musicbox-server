import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { FileService } from './file/file.service';
import { SharpService } from './sharp/sharp.service';
import { UserService } from './user/user.service';

@Module({
  providers: [FileService, SharpService, UserService],
  exports: [FileService, SharpService, UserService],
  imports: [PrismaModule],
})
export class ServicesModule {}
