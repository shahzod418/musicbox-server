import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { ManagerAlbumService } from './album.service';

describe('ManagerAlbumService', () => {
  let service: ManagerAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagerAlbumService],
    }).compile();

    service = module.get<ManagerAlbumService>(ManagerAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
