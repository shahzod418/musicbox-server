import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ArtistSongController } from './song.controller';
import { ArtistSongService } from './song.service';

describe('ArtistSongController', () => {
  let controller: ArtistSongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistSongController],
      providers: [ArtistSongService],
    }).compile();

    controller = module.get<ArtistSongController>(ArtistSongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
