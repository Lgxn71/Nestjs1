import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDTO } from './data-transfer-object/AuthCredentialsDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<boolean> {
    return await this.authService.signUp(authCredentialsDTO);
  }

  @Post('/sign-in')
  async singIn(
    @Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDTO);
  }
}
