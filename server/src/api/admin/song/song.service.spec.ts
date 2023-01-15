import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminSongService } from './song.service';

describe('AdminSongService', () => {
  let service: AdminSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSongService],
    }).compile();

    service = module.get<AdminSongService>(AdminSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
