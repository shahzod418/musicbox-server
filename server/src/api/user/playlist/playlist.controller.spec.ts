import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserPlaylistController } from './playlist.controller';
import { UserPlaylistService } from './playlist.service';

describe('UserPlaylistController', () => {
  let controller: UserPlaylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPlaylistController],
      providers: [UserPlaylistService],
    }).compile();

    controller = module.get<UserPlaylistController>(UserPlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
