import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicAlbumController } from './album.controller';
import { MusicAlbumService } from './album.service';

describe('MusicAlbumController', () => {
  let controller: MusicAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicAlbumController],
      providers: [MusicAlbumService],
    }).compile();

    controller = module.get<MusicAlbumController>(MusicAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
