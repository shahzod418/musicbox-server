import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentCoverService } from './cover.service';

describe('ContentCoverService', () => {
  let service: ContentCoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentCoverService],
    }).compile();

    service = module.get<ContentCoverService>(ContentCoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
