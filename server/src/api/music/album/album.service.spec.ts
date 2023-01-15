import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicAlbumService } from './album.service';

describe('MusicAlbumService', () => {
  let service: MusicAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicAlbumService],
    }).compile();

    service = module.get<MusicAlbumService>(MusicAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
