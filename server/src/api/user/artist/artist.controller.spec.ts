import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserArtistController } from './artist.controller';
import { UserArtistService } from './artist.service';

describe('UserArtistController', () => {
  let controller: UserArtistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserArtistController],
      providers: [UserArtistService],
    }).compile();

    controller = module.get<UserArtistController>(UserArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
