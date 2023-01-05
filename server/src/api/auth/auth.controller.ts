import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import type { User } from '@prisma/client';

import { UserSignIn, UserSignUp } from './auth.schema';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signUp(@Body() data: UserSignUp): Promise<User> {
    const user = await this.authService.signUp(data);
    if (user instanceof Error) {
      throw new BadRequestException(user.message);
    }

    return user;
  }

  @Post('signin')
  public async signIn(@Body() data: UserSignIn): Promise<User> {
    const user = await this.authService.signIn(data);
    if (user instanceof Error) {
      throw new BadRequestException(user.message);
    }

    return user;
  }
}
