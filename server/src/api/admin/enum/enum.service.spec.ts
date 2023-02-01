import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminEnumService } from './enum.service';

describe('AdminEnumService', () => {
  let service: AdminEnumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminEnumService],
    }).compile();

    service = module.get<AdminEnumService>(AdminEnumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
