import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { InvalidPasswordError, UserExistError } from '@errors/auth';
import { PrismaClientError } from '@errors/prisma';
import { ValidationBodyPipe } from '@pipes/validation-body';

import type { IAccessToken, IUser } from './auth.interface';

import { ISignData } from './auth.interface';

import { AuthService } from './auth.service';
import { signSchema } from './auth.validation';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public async signUp(
    @Body(new ValidationBodyPipe<ISignData>(signSchema)) data: ISignData,
  ): Promise<IUser> {
    try {
      return await this.authService.signUp(data);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.meta.cause);
      }

      if (error instanceof UserExistError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post('sign-in')
  public async signIn(
    @Body(new ValidationBodyPipe<ISignData>(signSchema)) data: ISignData,
  ): Promise<IAccessToken> {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      if (error instanceof PrismaClientError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof InvalidPasswordError) {
        throw new UnauthorizedException(error.message);
      }

      throw error;
    }
  }
}
