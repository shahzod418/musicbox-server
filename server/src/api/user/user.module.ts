import { Module } from '@nestjs/common';

import { UserAlbumModule } from './album/album.module';
import { UserArtistModule } from './artist/artist.module';
import { UserPlaylistModule } from './playlist/playlist.module';
import { UserProfileModule } from './profile/profile.module';
import { UserSongModule } from './song/song.module';

@Module({
  imports: [
    UserAlbumModule,
    UserArtistModule,
    UserPlaylistModule,
    UserProfileModule,
    UserSongModule,
  ],
})
export class UserModule {}
