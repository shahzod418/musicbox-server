import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminAlbumService } from './album.service';

describe('AdminAlbumService', () => {
  let service: AdminAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminAlbumService],
    }).compile();

    service = module.get<AdminAlbumService>(AdminAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
