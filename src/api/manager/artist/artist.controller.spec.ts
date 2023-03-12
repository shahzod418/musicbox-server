import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerArtistController } from './artist.controller';
import { ManagerArtistService } from './artist.service';

describe('ManagerArtistController', () => {
  let controller: ManagerArtistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerArtistController],
      providers: [ManagerArtistService],
    }).compile();

    controller = module.get<ManagerArtistController>(ManagerArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
