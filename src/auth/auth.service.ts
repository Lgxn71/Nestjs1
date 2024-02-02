import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthCredentialsDTO } from './data-transfer-object/AuthCredentialsDTO';
import { UserModel } from './user.model';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtSerivce: JwtService,
    private readonly userModel: UserModel,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<boolean> {
    return await this.userModel.signUp(authCredentialsDTO);
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{
    accessToken: string;
  }> {
    const { userName, password: enteredUserPassword } = authCredentialsDTO;

    const foundUser = await this.userModel.findUserByUsername(userName);

    const isCredentialsValid = await this.userModel.validateUserPassword(
      enteredUserPassword,
      foundUser.password,
    );

    if (!isCredentialsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { userName };
    const accessToken = await this.jwtSerivce.signAsync(payload);
    return { accessToken };
  }
}
