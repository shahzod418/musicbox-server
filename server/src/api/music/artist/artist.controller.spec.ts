import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicArtistController } from './artist.controller';
import { MusicArtistService } from './artist.service';

describe('MusicArtistController', () => {
  let controller: MusicArtistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicArtistController],
      providers: [MusicArtistService],
    }).compile();

    controller = module.get<MusicArtistController>(MusicArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
