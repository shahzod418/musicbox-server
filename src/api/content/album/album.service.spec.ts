import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAlbumService } from './album.service';

describe('ContentAlbumService', () => {
  let service: ContentAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentAlbumService],
    }).compile();

    service = module.get<ContentAlbumService>(ContentAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
