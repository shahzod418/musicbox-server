import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserSongController } from './song.controller';
import { UserSongService } from './song.service';

describe('UserSongController', () => {
  let controller: UserSongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSongController],
      providers: [UserSongService],
    }).compile();

    controller = module.get<UserSongController>(UserSongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
