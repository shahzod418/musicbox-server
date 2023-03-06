import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@services/user/user.service';

import type { IUserRequest } from '@interfaces/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly user: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(
    payload: IUserRequest['user'],
  ): Promise<IUserRequest['user']> {
    const role = await this.user.getUserRole(payload.id);

    return { id: payload.id, role };
  }
}
