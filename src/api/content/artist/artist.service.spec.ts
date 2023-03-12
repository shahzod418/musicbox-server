import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentArtistService } from './artist.service';

describe('ContentArtistService', () => {
  let service: ContentArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentArtistService],
    }).compile();

    service = module.get<ContentArtistService>(ContentArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
