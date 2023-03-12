import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminAlbumController } from './album.controller';
import { AdminAlbumService } from './album.service';

describe('AdminAlbumController', () => {
  let controller: AdminAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAlbumController],
      providers: [AdminAlbumService],
    }).compile();

    controller = module.get<AdminAlbumController>(AdminAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
