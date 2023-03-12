import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

@Injectable()
export class AdminEnumService {
  public findAllRole(): Role[] {
    return Object.values(Role);
  }

  public findAllStatus(): Status[] {
    return Object.values(Status);
  }
}
