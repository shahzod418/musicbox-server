import { BadRequestException, Injectable } from '@nestjs/common';

import { SharpService } from '@services/sharp/sharp.service';

import type { IFile } from '@interfaces/file';
import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseAvatarPipe implements PipeTransform {
  private readonly sharpService = new SharpService();

  constructor(private readonly options?: { optional?: boolean }) {}

  public async transform(files: {
    avatar?: Express.Multer.File[];
  }): Promise<{ avatar?: IFile }> {
    try {
      const avatar =
        files?.avatar instanceof Array ? files?.avatar?.at(0) : files?.avatar;

      if (!avatar && !this.options?.optional) {
        throw new Error('Avatar is required');
      }

      return {
        ...files,
        avatar: avatar && (await this.sharpService.getAvatar(avatar)),
      };
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
