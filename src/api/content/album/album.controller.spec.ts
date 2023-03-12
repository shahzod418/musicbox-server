import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentAlbumController } from './album.controller';
import { ContentAlbumService } from './album.service';

describe('ContentAlbumController', () => {
  let controller: ContentAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentAlbumController],
      providers: [ContentAlbumService],
    }).compile();

    controller = module.get<ContentAlbumController>(ContentAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
