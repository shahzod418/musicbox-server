import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ArtistAlbumService } from './album.service';

describe('ArtistAlbumService', () => {
  let service: ArtistAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistAlbumService],
    }).compile();

    service = module.get<ArtistAlbumService>(ArtistAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
