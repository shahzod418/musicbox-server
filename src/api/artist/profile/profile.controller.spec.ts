import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ArtistProfileController } from './profile.controller';
import { ArtistProfileService } from './profile.service';

describe('ArtistProfileController', () => {
  let controller: ArtistProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistProfileController],
      providers: [ArtistProfileService],
    }).compile();

    controller = module.get<ArtistProfileController>(ArtistProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
