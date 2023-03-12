import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerAlbumController } from './song.controller';
import { ManagerSongService } from './song.service';

describe('ManagerAlbumController', () => {
  let controller: ManagerAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerAlbumController],
      providers: [ManagerSongService],
    }).compile();

    controller = module.get<ManagerAlbumController>(ManagerAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
