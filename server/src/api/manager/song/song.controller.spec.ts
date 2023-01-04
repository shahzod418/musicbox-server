import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AlbumController } from './song.controller';
import { SongService } from './song.service';

describe('AlbumController', () => {
  let controller: AlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [SongService],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
