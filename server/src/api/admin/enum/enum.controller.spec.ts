import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminEnumController } from './enum.controller';
import { AdminEnumService } from './enum.service';

describe('AdminEnumController', () => {
  let controller: AdminEnumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEnumController],
      providers: [AdminEnumService],
    }).compile();

    controller = module.get<AdminEnumController>(AdminEnumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
