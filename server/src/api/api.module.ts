import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ManagerModule } from './manager/manager.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AdminModule,
    ArtistModule,
    AuthModule,
    ContentModule,
    ManagerModule,
    MusicModule,
    UserModule,
  ],
})
export class ApiModule {}
