import { randomBytes } from 'crypto';
import { parse } from 'path';

import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import type { IFile } from '@interfaces/file';
import type { FormatEnum, Sharp } from 'sharp';

@Injectable()
export class SharpService {
  private readonly supportedFormats: (keyof FormatEnum)[] = [
    'jpeg',
    'jpg',
    'png',
  ];

  public async getAvatar(file: Express.Multer.File): Promise<IFile> {
    const { buffer, originalname } = file;

    const image = await this.getSharpImage(buffer);

    await this.checkImageFormat(image);

    const data = await image.resize(512, 512).jpeg({ quality: 80 }).toBuffer();

    return {
      data,
      name: this.getFileName(originalname),
    };
  }

  public async getCover(file: Express.Multer.File): Promise<IFile> {
    const { buffer, originalname } = file;

    const image = await this.getSharpImage(buffer);

    await this.checkImageFormat(image);

    const data = await image.jpeg({ quality: 80 }).toBuffer();

    return {
      data,
      name: this.getFileName(originalname),
    };
  }

  private getSharpImage(data: Buffer): Promise<Sharp> {
    return new Promise((resolve, reject) => {
      sharp(data)
        .metadata()
        .catch(() => reject('Not image'))
        .finally(() => resolve(sharp(data)));
    });
  }

  private checkImageFormat(image: Sharp): Promise<void> {
    return new Promise((resolve, reject) => {
      image
        .metadata()
        .then(({ format }) => {
          if (!format || !this.supportedFormats.includes(format)) {
            reject(`Unsupported format: ${format}`);
          }
          resolve();
        })
        .catch(() => reject('Unexpected error'));
    });
  }

  private getFileName(filename: string): string {
    return randomBytes(Math.ceil(filename.length / 2)).toString('hex') + '.jpg';
  }
}
