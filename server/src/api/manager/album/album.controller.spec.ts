import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerAlbumController } from './album.controller';
import { ManagerAlbumService } from './album.service';

describe('ManagerAlbumController', () => {
  let controller: ManagerAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerAlbumController],
      providers: [ManagerAlbumService],
    }).compile();

    controller = module.get<ManagerAlbumController>(ManagerAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
