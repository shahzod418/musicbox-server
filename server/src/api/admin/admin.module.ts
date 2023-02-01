import { Module } from '@nestjs/common';

import { AdminAlbumModule } from './album/album.module';
import { AdminArtistModule } from './artist/artist.module';
import { AdminEnumModule } from './enum/enum.module';
import { AdminSongModule } from './song/song.module';
import { AdminUserModule } from './user/user.module';

@Module({
  imports: [
    AdminAlbumModule,
    AdminArtistModule,
    AdminEnumModule,
    AdminSongModule,
    AdminUserModule,
  ],
})
export class AdminModule {}
