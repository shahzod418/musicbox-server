import { Module } from '@nestjs/common';

import { ManagerAlbumModule } from './album/album.module';
import { ManagerArtistModule } from './artist/artist.module';
import { ManagerSongModule } from './song/song.module';

@Module({
  imports: [ManagerAlbumModule, ManagerArtistModule, ManagerSongModule],
})
export class ManagerModule {}
