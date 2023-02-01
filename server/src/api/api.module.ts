import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ManagerModule } from './manager/manager.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AdminModule,
    ArtistModule,
    AuthModule,
    ContentModule,
    ManagerModule,
    UserModule,
  ],
})
export class ApiModule {}
