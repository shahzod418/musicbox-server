import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserPlaylistService } from './playlist.service';

describe('UserPlaylistService', () => {
  let service: UserPlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPlaylistService],
    }).compile();

    service = module.get<UserPlaylistService>(UserPlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
