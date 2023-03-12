import { Module } from '@nestjs/common';

import { ArtistAlbumModule } from './album/album.module';
import { ArtistProfileModule } from './profile/profile.module';
import { ArtistSongModule } from './song/song.module';

@Module({
  imports: [ArtistAlbumModule, ArtistProfileModule, ArtistSongModule],
})
export class ArtistModule {}
