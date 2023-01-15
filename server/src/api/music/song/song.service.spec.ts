import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { MusicSongService } from './song.service';

describe('MusicSongService', () => {
  let service: MusicSongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicSongService],
    }).compile();

    service = module.get<MusicSongService>(MusicSongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
