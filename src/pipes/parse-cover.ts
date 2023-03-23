import { BadRequestException, Injectable } from '@nestjs/common';

import { SharpService } from '@services/sharp/sharp.service';

import type { IFile } from '@interfaces/file';
import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseCoverPipe implements PipeTransform {
  private readonly sharpService = new SharpService();

  constructor(private readonly options?: { optional?: boolean }) {}

  public async transform(files: { cover?: Express.Multer.File[] }): Promise<{
    cover: IFile;
  }> {
    try {
      const cover =
        files?.cover instanceof Array ? files?.cover?.at(0) : files?.cover;

      if (!cover && !this.options?.optional) {
        throw new BadRequestException('Cover is required');
      }

      return {
        ...files,
        cover: cover && (await this.sharpService.getCover(cover)),
      };
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
