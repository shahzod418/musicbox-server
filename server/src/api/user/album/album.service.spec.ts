import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { UserAlbumService } from './album.service';

describe('UserAlbumService', () => {
  let service: UserAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAlbumService],
    }).compile();

    service = module.get<UserAlbumService>(UserAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
