import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ContentArtistController } from './artist.controller';
import { ContentArtistService } from './artist.service';

describe('ContentArtistController', () => {
  let controller: ContentArtistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentArtistController],
      providers: [ContentArtistService],
    }).compile();

    controller = module.get<ContentArtistController>(ContentArtistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
