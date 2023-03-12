import { Module } from '@nestjs/common';

import { ContentAlbumModule } from './album/album.module';
import { ContentArtistModule } from './artist/artist.module';
import { ContentAudioModule } from './audio/audio.module';
import { ContentAvatarModule } from './avatar/avatar.module';
import { ContentCoverModule } from './cover/cover.module';
import { ContentSongModule } from './song/song.module';

@Module({
  imports: [
    ContentAlbumModule,
    ContentArtistModule,
    ContentAudioModule,
    ContentAvatarModule,
    ContentCoverModule,
    ContentSongModule,
  ],
})
export class ContentModule {}
