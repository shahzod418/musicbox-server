import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicSongController } from './song.controller';
import { MusicSongService } from './song.service';

describe('MusicSongController', () => {
  let controller: MusicSongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicSongController],
      providers: [MusicSongService],
    }).compile();

    controller = module.get<MusicSongController>(MusicSongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
