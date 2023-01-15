import { Module } from '@nestjs/common';

import { MusicAlbumModule } from './album/album.module';
import { MusicArtistModule } from './artist/artist.module';
import { MusicSongModule } from './song/song.module';

@Module({
  imports: [MusicAlbumModule, MusicArtistModule, MusicSongModule],
})
export class MusicModule {}
