import { Module } from '@nestjs/common';

import { AlbumModule } from './album/album.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [AlbumModule, SongModule],
})
export class ArtistModule {}
