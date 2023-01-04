import { IsBoolean } from 'class-validator';

import type { Prisma } from '@prisma/client';

export class ISongUpdateExplicitInput
  implements Pick<Prisma.SongUpdateInput, 'explicit'>
{
  @IsBoolean()
  explicit: boolean;
}
