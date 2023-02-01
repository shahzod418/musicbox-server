import { Module } from '@nestjs/common';

import { AdminEnumController } from './enum.controller';
import { AdminEnumService } from './enum.service';

@Module({
  controllers: [AdminEnumController],
  providers: [AdminEnumService],
})
export class AdminEnumModule {}
