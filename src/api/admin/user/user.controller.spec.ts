import { Test } from '@nestjs/testing';

import type { TestingModule } from '@nestjs/testing';

import { AdminUserController } from './user.controller';
import { AdminUserService } from './user.service';

describe('AdminUserController', () => {
  let controller: AdminUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminUserController],
      providers: [AdminUserService],
    }).compile();

    controller = module.get<AdminUserController>(AdminUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
