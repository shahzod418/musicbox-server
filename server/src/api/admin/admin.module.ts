import { Module } from '@nestjs/common';

import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AlbumModule, ArtistModule, SongModule, UserModule],
})
export class AdminModule {}
