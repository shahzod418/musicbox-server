import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ArtistSongService } from './song.service';

describe('ArtistSongService', () => {
  let service: ArtistSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistSongService],
    }).compile();

    service = module.get<ArtistSongService>(ArtistSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
