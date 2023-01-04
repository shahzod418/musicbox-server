import { Module } from '@nestjs/common';

import { ArtistModule } from './artist/artist.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [ArtistModule, PlaylistModule],
})
export class UserModule {}
