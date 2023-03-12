import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminArtistController } from './artist.controller';
import { AdminArtistService } from './artist.service';

describe('AdminArtistController', () => {
  let controller: AdminArtistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminArtistController],
      providers: [AdminArtistService],
    }).compile();

    controller = module.get<AdminArtistController>(AdminArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
