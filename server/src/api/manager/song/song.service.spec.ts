import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerSongService } from './song.service';

describe('ManagerSongService', () => {
  let service: ManagerSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerSongService],
    }).compile();

    service = module.get<ManagerSongService>(ManagerSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
