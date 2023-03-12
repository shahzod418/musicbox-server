import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAvatarService } from './avatar.service';

describe('ContentAvatarService', () => {
  let service: ContentAvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentAvatarService],
    }).compile();

    service = module.get<ContentAvatarService>(ContentAvatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
