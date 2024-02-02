import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import PRISMA_ERROR_CODES from '../prisma/prisma.error_codes.enum';

import * as bcrypt from 'bcrypt';

import { nanoid } from 'nanoid';

import { AuthCredentialsDTO } from './data-transfer-object/AuthCredentialsDTO';

@Injectable()
export class UserModel {
  private logger = new Logger('UserModel');

  constructor(private readonly prisma: PrismaService) {}

  public async signUp(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<boolean> {
    const { userName, password: userEnteredPassword } = authCredentialsDTO;

    try {
      const { salt, hashedPassword } =
        await this.hashPassword(userEnteredPassword);
      const user = await this.prisma.user.create({
        data: {
          id: nanoid(),
          userName,
          password: hashedPassword,
          salt,
        },
      });

      this.logger.log('Created user: ', user);

      return true;
    } catch (error) {
      this.handleError(error, userName);
    }
  }

  public async validateUserPassword(
    enteredUserPassword: string,
    hashedUserPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredUserPassword, hashedUserPassword);
  }

  public async findUserByUsername(userName: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { userName },
      });
      this.logger.log('User was found by userName:', user);

      return user;
    } catch (error) {
      this.handleError(error, userName);
    }
  }

  private async hashPassword(
    password: string,
  ): Promise<{ salt: string; hashedPassword: string }> {
    const generatedSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, generatedSalt);
    return { salt: generatedSalt, hashedPassword };
  }

  private handleError(error: any, userName: string): void {
    this.logger.log('Error is :', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
        throw new NotFoundException(`Username: ${userName} not found`);
      }
      if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED) {
        throw new ConflictException(`Username: ${userName} is taken already`);
      }
    } else {
      throw new InternalServerErrorException();
    }
  }
}
