import { BadRequestException, Injectable } from '@nestjs/common';

import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class CoverValidationPipe implements PipeTransform {
  constructor(private readonly options?: { optional?: boolean }) {}

  transform(files: { cover?: Express.Multer.File[] }): {
    cover: Express.Multer.File;
  } {
    const cover =
      files?.cover instanceof Array ? files?.cover?.at(0) : files?.cover;

    if (!this.options?.optional) {
      if (!cover) {
        throw new BadRequestException('Cover is required');
      }
    }

    if (cover) {
      if (cover.mimetype !== 'image/jpeg') {
        throw new BadRequestException('Not image');
      }
    }

    return { ...files, cover };
  }
}
