import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { NotFoundError } from '@errors/not-found';
import { PrismaClientError } from '@errors/prisma';

import { ContentAudioService } from './audio.service';

@Controller('api/content')
export class ContentAudioController {
  constructor(private readonly contentAudioService: ContentAudioService) {}

  @Get('songs/:songId/audio')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'audio/mpeg')
  public async getAudio(
    @Res() res: Response,
    @Headers('range') range: string | undefined,
    @Param('songId', ParseIntPipe) songId: number,
  ): Promise<void> {
    try {
      const { stream, size, start, end } =
        await this.contentAudioService.getAudio(songId, Role.ADMIN, range);

      if (range) {
        const chunksize = end - start + 1;

        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': chunksize,
        });
        stream.pipe(res);
      } else {
        res.writeHead(HttpStatus.OK, {
          'Content-Length': size,
        });
        stream.pipe(res);
      }
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof NotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
