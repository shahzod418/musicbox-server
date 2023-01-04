import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { ManagerModule } from './manager/manager.module';
import { MusicModule } from './music/music.module';
import { SingModule } from './auth/sing.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AdminModule,
    ArtistModule,
    ManagerModule,
    MusicModule,
    SingModule,
    UserModule,
  ],
})
export class ApiModule {}
