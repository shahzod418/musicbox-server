import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentSongController } from './song.controller';
import { ContentSongService } from './song.service';

describe('ContentSongController', () => {
  let controller: ContentSongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentSongController],
      providers: [ContentSongService],
    }).compile();

    controller = module.get<ContentSongController>(ContentSongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
