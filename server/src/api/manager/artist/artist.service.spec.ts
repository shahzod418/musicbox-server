import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerArtistService } from './artist.service';

describe('ManagerArtistService', () => {
  let service: ManagerArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerArtistService],
    }).compile();

    service = module.get<ManagerArtistService>(ManagerArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
