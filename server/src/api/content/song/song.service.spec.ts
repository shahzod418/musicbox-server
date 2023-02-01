import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentSongService } from './song.service';

describe('ContentSongService', () => {
  let service: ContentSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentSongService],
    }).compile();

    service = module.get<ContentSongService>(ContentSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
