import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicArtistService } from './artist.service';

describe('MusicArtistService', () => {
  let service: MusicArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicArtistService],
    }).compile();

    service = module.get<MusicArtistService>(MusicArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
