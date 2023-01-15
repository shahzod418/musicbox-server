import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserArtistService } from './artist.service';

describe('UserArtistService', () => {
  let service: UserArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserArtistService],
    }).compile();

    service = module.get<UserArtistService>(UserArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
