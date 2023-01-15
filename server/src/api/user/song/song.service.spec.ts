import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserSongService } from './song.service';

describe('UserSongService', () => {
  let service: UserSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSongService],
    }).compile();

    service = module.get<UserSongService>(UserSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
