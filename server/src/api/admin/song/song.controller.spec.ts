import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminSongController } from './song.controller';
import { AdminSongService } from './song.service';

describe('AdminSongController', () => {
  let controller: AdminSongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSongController],
      providers: [AdminSongService],
    }).compile();

    controller = module.get<AdminSongController>(AdminSongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
