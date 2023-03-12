import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAudioController } from './audio.controller';
import { ContentAudioService } from './audio.service';

describe('ContentAudioController', () => {
  let controller: ContentAudioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentAudioController],
      providers: [ContentAudioService],
    }).compile();

    controller = module.get<ContentAudioController>(ContentAudioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
