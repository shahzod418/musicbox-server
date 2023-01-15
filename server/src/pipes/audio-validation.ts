import { BadRequestException, Injectable } from '@nestjs/common';

import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class AudioValidationPipe implements PipeTransform {
  constructor(private readonly options?: { optional?: boolean }) {}

  transform(files: { audio?: Express.Multer.File[] }): {
    audio: Express.Multer.File;
  } {
    const audio =
      files?.audio instanceof Array ? files?.audio?.at(0) : files?.audio;

    if (!this.options?.optional) {
      if (!audio) {
        throw new BadRequestException('Audio is required');
      }
    }

    if (audio) {
      if (audio.mimetype !== 'audio/mpeg') {
        throw new BadRequestException('Not audio');
      }
    }

    return { ...files, audio };
  }
}
