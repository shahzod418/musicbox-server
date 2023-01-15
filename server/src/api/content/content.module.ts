import { Module } from '@nestjs/common';

import { AudioModule } from './audio/audio.module';
import { AvatarModule } from './avatar/avatar.module';
import { CoverModule } from './cover/cover.module';

@Module({
  imports: [AudioModule, AvatarModule, CoverModule],
})
export class ContentModule {}
