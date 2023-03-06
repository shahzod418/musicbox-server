import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { InvalidPassword, UserAlreadyExists } from '@errors/auth';
import { UserService } from '@services/user/user.service';

import type { IAccessToken, ISignData, IUser } from './auth.interface';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  public async signUp(data: ISignData): Promise<IUser> {
    const { email, password } = data;

    const isUniqueUser = await this.user.isUnique(data.email);
    if (!isUniqueUser) {
      throw new UserAlreadyExists();
    }

    const hashPassword = await hash(password, 10);

    const { id } = await this.user.create({ email, hash: hashPassword });

    return { id, email };
  }

  public async signIn(data: ISignData): Promise<IAccessToken> {
    const { email, password } = data;

    const user = await this.user.findOne(email);

    const isValidPassword = await compare(password, user.hash);

    if (!isValidPassword) {
      throw new InvalidPassword();
    }

    return await this.getJwt(user);
  }

  private async getJwt(
    payload: Pick<User, 'id' | 'role'>,
  ): Promise<IAccessToken> {
    const { id, role } = payload;

    return {
      access_token: await this.jwt.signAsync({ id, role }),
    };
  }
}
