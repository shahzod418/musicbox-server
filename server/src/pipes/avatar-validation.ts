import { BadRequestException, Injectable } from '@nestjs/common';

import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  constructor(private readonly options?: { optional?: boolean }) {}

  transform(files: { avatar?: Express.Multer.File[] }): {
    avatar: Express.Multer.File;
  } {
    const avatar =
      files?.avatar instanceof Array ? files?.avatar?.at(0) : files?.avatar;

    if (!this.options?.optional) {
      if (!avatar) {
        throw new BadRequestException('Avatar is required');
      }
    }

    if (avatar) {
      if (avatar.mimetype !== 'image/jpeg') {
        throw new BadRequestException('Not image');
      }
    }

    return { ...files, avatar };
  }
}
