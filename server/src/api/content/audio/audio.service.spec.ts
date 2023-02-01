import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAudioService } from './audio.service';

describe('ContentAudioService', () => {
  let service: ContentAudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentAudioService],
    }).compile();

    service = module.get<ContentAudioService>(ContentAudioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
