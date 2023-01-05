import { Module } from '@nestjs/common';

import { AlbumModule } from './album/album.module';
import { ProfileModule } from './profile/profile.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [AlbumModule, ProfileModule, SongModule],
})
export class ArtistModule {}
