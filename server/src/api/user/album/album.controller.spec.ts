import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserAlbumController } from './album.controller';
import { UserAlbumService } from './album.service';

describe('UserAlbumController', () => {
  let controller: UserAlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAlbumController],
      providers: [UserAlbumService],
    }).compile();

    controller = module.get<UserAlbumController>(UserAlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
