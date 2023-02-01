import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAvatarController } from './avatar.controller';
import { ContentAvatarService } from './avatar.service';

describe('ContentAvatarController', () => {
  let controller: ContentAvatarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentAvatarController],
      providers: [ContentAvatarService],
    }).compile();

    controller = module.get<ContentAvatarController>(ContentAvatarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
