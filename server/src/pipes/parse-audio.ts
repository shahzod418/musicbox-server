import { randomBytes } from 'crypto';
import { parse } from 'path';

import { BadRequestException, Injectable } from '@nestjs/common';

import type { IFile } from '@interfaces/file';
import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseAudioPipe implements PipeTransform {
  constructor(private readonly options?: { optional?: boolean }) {}

  transform(files: { audio?: Express.Multer.File[] }): {
    audio: IFile;
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

      if (parse(audio.originalname).ext !== '.mp3') {
        throw new BadRequestException('MP3 only');
      }
    }

    return {
      ...files,
      audio: audio && {
        data: audio.buffer,
        name:
          randomBytes(Math.ceil(audio.originalname.length / 2)).toString(
            'hex',
          ) + '.mp3',
      },
    };
  }
}
