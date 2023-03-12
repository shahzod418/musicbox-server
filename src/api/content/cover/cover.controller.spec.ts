import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentCoverController } from './cover.controller';
import { ContentCoverService } from './cover.service';

describe('ContentCoverController', () => {
  let controller: ContentCoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentCoverController],
      providers: [ContentCoverService],
    }).compile();

    controller = module.get<ContentCoverController>(ContentCoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
