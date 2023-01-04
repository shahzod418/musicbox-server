import { Global, Module } from '@nestjs/common';

import { FileService } from './file/file.service';
import { UserService } from './user/user.service';

@Global()
@Module({
  providers: [FileService, UserService],
  exports: [FileService, UserService],
})
export class ServicesModule {}
