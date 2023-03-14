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
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { UserId, UserRole } from '@decorators/users.decorator';
import { NotFoundError } from '@errors/not-found';
import { PrismaClientError } from '@errors/prisma';
import { OptionalJwtAuthGuard } from '@guards/optional-jwt-auth.guard';

import { ContentAudioService } from './audio.service';

@Controller('api/content')
export class ContentAudioController {
  constructor(private readonly contentAudioService: ContentAudioService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('songs/:songId/audio')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'audio/mpeg')
  public async getAudio(
    @Res() res: Response,
    @Headers('range') range: string | undefined,
    @Param('songId', ParseIntPipe) songId: number,
    @UserId() userId?: number,
    @UserRole() role?: Role,
  ): Promise<void> {
    try {
      const { stream, size, start, end } =
        await this.contentAudioService.getAudio(songId, range, userId, role);

      if (range) {
        const chunksize = end - start + 1;

        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': chunksize,
        });

        stream.pipe(res);
        stream.on('close', () => {
          void this.contentAudioService.addListens(songId);
        });
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
