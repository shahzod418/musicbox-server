import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ArtistAlbumController } from './album.controller';
import { ArtistAlbumService } from './album.service';

describe('ArtistAlbumController', () => {
  let controller: ArtistAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistAlbumController],
      providers: [ArtistAlbumService],
    }).compile();

    controller = module.get<ArtistAlbumController>(ArtistAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
